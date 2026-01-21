import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import Coupon from '../models/coupon.model.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ message: 'productId and size are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId && item.size === size);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, size, quantity: 1 });
    }

    await cart.save();
    await cart.populate('items.productId');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, size, quantity } = req.body;

    if (!productId || !size || quantity === undefined) {
      return res.status(400).json({ message: 'productId, size and quantity are required' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.productId.toString() === productId && item.size === size);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    if (quantity <= 0) {
      cart.items = cart.items.filter(item => !(item.productId.toString() === productId && item.size === size));
    }

    await cart.save();
    await cart.populate('items.productId');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ message: 'productId and size are required' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => !(item.productId.toString() === productId && item.size === size));
    await cart.save();
    await cart.populate('items.productId');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items: [], couponCode: '', discountPercentage: 0 },
      { new: true }
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};

export const applyCoupon = async (req, res) => {
    try {
        const userId = req.user._id;
        const { code } = req.body;

        const coupon = await Coupon.findOne({ code });

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ message: 'Coupon is not active' });
        }

        if (coupon.expiryDate && coupon.expiryDate < new Date()) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            return res.status(400).json({ message: 'Coupon has reached its usage limit' });
        }

        const cart = await Cart.findOneAndUpdate(
            { userId },
            { couponCode: code, discountPercentage: coupon.discountPercentage },
            { new: true }
        ).populate('items.productId');

        coupon.usedCount += 1;
        await coupon.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error applying coupon', error: error.message });
    }
};

export const removeCoupon = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { couponCode: '', discountPercentage: 0 },
      { new: true }
    ).populate('items.productId');

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing coupon', error: error.message });
  }
};

