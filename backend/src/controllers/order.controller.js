import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import Settings from '../models/settings.model.js';

import { generateInvoicePDF } from '../lib/invoice.js';

export const getInvoice = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);

        generateInvoicePDF(order, res);
    } catch (error) {
        console.error('Error generating invoice:', error);
        res.status(500).json({ message: 'Error generating invoice' });
    }
};

// NOTE: Removed `import Product from '../models/product.model.js';` 
// because it is only imported dynamically in placeOrder and not needed statically

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({
            userId
        }).sort({
            createdAt: -1
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const {
            orderId
        } = req.params;
        const userId = req.user._id;

        const order = await Order.findOne({
            _id: orderId,
            userId
        });
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching order',
            error: error.message
        });
    }
};

export const placeOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userId = req.user._id;
        const {
            shippingAddress,
            paymentMethod,
            notes
        } = req.body;

        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({ message: 'shippingAddress and paymentMethod are required' });
        }

        const cart = await Cart.findOne({
            userId
        }).session(session);
        if (!cart || !cart.items || cart.items.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: 'Cart is empty'
            });
        }

        const productIds = cart.items.map(item => item.productId);
        const products = await Product.find({
            _id: {
                $in: productIds
            }
        }).session(session);

        const productMap = new Map(products.map(p => [p._id.toString(), p]));

        let subtotal = 0;
        const items = [];
        for (const item of cart.items) {
            const product = productMap.get(item.productId.toString());
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({
                    message: `Product with ID ${item.productId} not found`,
                    productId: item.productId,
                });
            }
            if (product.stock < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    message: `Product "${product.name}" is out of stock.`,
                    productId: item.productId,
                });
            }
            const price = product.price;
            subtotal += price * item.quantity;
            items.push({
                productId: product._id,
                name: product.name,
                price: price,
                size: item.size,
                quantity: item.quantity,
                image: Array.isArray(product.image) ? product.image[0] : product.image
            });
        }

        const discount = (subtotal * (cart.discountPercentage || 0)) / 100;

        const settings = await Settings.getSettings();
        const freeShippingThreshold = settings?.freeShippingThreshold ?? 500;
        const deliveryFee = subtotal >= freeShippingThreshold ? 0 : (settings?.deliveryFee ?? 50);

        const total = subtotal - discount + deliveryFee;

        const order = new Order({
            userId,
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            discount,
            deliveryFee,
            total,
            status: 'Processing',
            estimatedDelivery,
            notes: notes || '',
            statusHistory: [{
                status: 'Processing',
                timestamp: new Date(),
                note: 'Order placed successfully'
            }]
        });

        await order.save({
            session
        });

        for (const item of items) {
            await Product.updateOne({
                _id: item.productId
            }, {
                $inc: {
                    stock: -item.quantity
                }
            }, {
                session
            });
        }

        cart.items = [];
        cart.couponCode = '';
        cart.discountPercentage = 0;
        await cart.save({
            session
        });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(order);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error placing order:', error);
        res.status(400).json({
            message: 'Error placing order',
            error: error.message
        });
    }
};

export const reorderItems = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            orderId
        } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            userId
        });
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        let cart = await Cart.findOne({
            userId
        });
        if (!cart) {
            cart = new Cart({
                userId,
                items: []
            });
        }

        // Add order items to cart (ensure consistent ID use)
        order.items.forEach(orderItem => {
            const existingItem = cart.items.find(item =>
                item.productId.toString() === orderItem.productId.toString() && item.size === orderItem.size
            );

            if (existingItem) {
                existingItem.quantity += orderItem.quantity;
            } else {
                cart.items.push({
                    productId: orderItem.productId,
                    size: orderItem.size,
                    quantity: orderItem.quantity
                });
            }
        });

        await cart.save();
        await cart.populate('items.productId');

        res.status(200).json({
            message: 'Items added to cart',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error reordering items',
            error: error.message
        });
    }
};

export const adminGetAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('userId', 'name email')
            .populate('items.productId', 'name image')
            .sort({
                createdAt: -1
            });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

export const adminUpdateOrderStatus = async (req, res) => {
    try {
        const {
            orderId
        } = req.params;
        const {
            status,
            trackingNumber,
            carrier,
            note
        } = req.body;

        const order = await Order.findOne({
            _id: orderId
        });
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        // Add to status history
        order.statusHistory.push({
            status: status,
            timestamp: new Date(),
            note: note || `Status changed to ${status}`
        });

        // Update order
        order.status = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (carrier) order.carrier = carrier;

        // Update estimated delivery when shipped
        if (status === 'Shipped' && !order.estimatedDelivery) {
            const estimatedDelivery = new Date();
            estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
            order.estimatedDelivery = estimatedDelivery;
        }

        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            message: 'Error updating order status',
            error: error.message
        });
    }
};

export const trackOrder = async (req, res) => {
    try {
        const {
            orderId
        } = req.params;

        const order = await Order.findOne({
                _id: orderId
            })
            .populate('userId', 'email fullName')
            .populate('items.productId', 'name image');

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        // Hide any sensitive fields
        res.status(200).json({
            orderId: order._id,
            status: order.status,
            trackingNumber: order.trackingNumber,
            carrier: order.carrier,
            estimatedDelivery: order.estimatedDelivery,
            statusHistory: order.statusHistory,
            shippingAddress: order.shippingAddress,
            items: order.items,
            total: order.total,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        });
    } catch (error) {
        console.error('Error tracking order:', error);
        res.status(500).json({
            message: 'Error tracking order',
            error: error.message
        });
    }
};