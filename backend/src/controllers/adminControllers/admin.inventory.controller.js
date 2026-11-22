import crypto from "crypto";
import fs from "fs/promises";
import Product from "../../models/product.model.js";
import Order from "../../models/order.model.js";
import InventoryMovement from "../../models/inventoryMovement.model.js";
import StockReservation from "../../models/stockReservation.model.js";
import { uploadImageToCloudinary } from "../../lib/utils.js";
import {
  getAvailableStock,
  recordPosSaleAtomic,
  releaseExpiredReservations,
} from "../../services/inventory.service.js";
import { getEffectiveUnitPrice } from "../../services/pricing.service.js";

export const getInventorySnapshot = async (req, res) => {
  try {
    await releaseExpiredReservations();

    const products = await Product.find({})
      .select("code name category subCategory price discountedPrice stock reserved status updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    const rows = products.map((p) => ({
      ...p,
      onHand: Number(p.stock) || 0,
      reserved: Number(p.reserved) || 0,
      available: getAvailableStock(p),
    }));

    const movements = await InventoryMovement.find({})
      .sort({ createdAt: -1 })
      .limit(40)
      .lean();

    const activeReservations = await StockReservation.find({ state: "active" })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return res.status(200).json({ products: rows, movements, activeReservations });
  } catch (error) {
    console.error("getInventorySnapshot error:", error);
    return res.status(500).json({ message: "Failed to load inventory snapshot" });
  }
};

export const recordPosSale = async (req, res) => {
  try {
    const {
      productId,
      productCode,
      quantity = 1,
      paymentMethod = "pos_cash",
      customerNote = "",
      idempotencyKey,
    } = req.body;

    let product = null;
    if (productId) {
      product = await Product.findById(productId);
    } else if (productCode) {
      product = await Product.findOne({ code: String(productCode).trim().toUpperCase() });
    }

    if (!product) {
      return res.status(404).json({ message: "Matching SKU/product not found" });
    }

    const qty = Math.max(1, Number(quantity) || 1);
    const orderNumber = `POS-${Date.now()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

    const saleResult = await recordPosSaleAtomic({
      productId: product._id,
      quantity: qty,
      actorId: req.user._id,
      referenceId: orderNumber,
      reason: customerNote ? `Store sale: ${customerNote}` : "Indore boutique sale",
      idempotencyKey,
    });

    if (saleResult.duplicate) {
      return res.status(200).json({
        success: true,
        duplicate: true,
        product: saleResult.product,
        movement: saleResult.movement,
      });
    }

    const unitPrice = getEffectiveUnitPrice(product);
    const total = Math.round(unitPrice * qty * 100) / 100;

    const posOrder = await Order.create({
      orderNumber,
      userId: req.user._id,
      items: [
        {
          productId: product._id,
          name: product.name,
          price: unitPrice,
          originalPrice: product.price,
          size: product.hasSizes && product.sizes?.[0] ? product.sizes[0] : "NO_SIZE",
          quantity: qty,
          image: Array.isArray(product.image) ? product.image[0] : product.image,
        },
      ],
      shippingAddress: {
        street: "In-Store Pickup (Indore Boutique)",
        city: "Indore",
        state: "Madhya Pradesh",
        zip: "452012",
        country: "India",
      },
      channel: "pos",
      paymentMethod,
      paymentStatus: "verified_success",
      expectedAmountPaise: Math.round(total * 100),
      currency: "INR",
      subtotal: total,
      discount: 0,
      deliveryFee: 0,
      total,
      status: "Delivered",
      notes: customerNote || "Physical boutique counter sale",
      statusHistory: [
        {
          status: "Delivered",
          timestamp: new Date(),
          note: "Recorded at physical boutique counter",
          actor: String(req.user._id),
        },
      ],
    });

    return res.status(201).json({
      success: true,
      product: saleResult.product,
      order: posOrder,
      movement: saleResult.movement,
    });
  } catch (error) {
    const code = error.code === "OUT_OF_STOCK" ? 409 : 500;
    return res.status(code).json({
      message: error.message || "Failed to record store sale",
    });
  }
};

export const adjustStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { newStock, reason = "Admin inventory reconciliation" } = req.body;

    const targetStock = Number(newStock);
    if (!Number.isFinite(targetStock) || targetStock < 0) {
      return res.status(400).json({ message: "Valid non-negative stock value is required" });
    }

    const current = await Product.findById(productId);
    if (!current) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reserved = Number(current.reserved) || 0;
    if (targetStock < reserved) {
      return res.status(409).json({
        message: `Cannot set stock below active reservations (${reserved}).`,
      });
    }

    const delta = targetStock - (Number(current.stock) || 0);
    current.stock = targetStock;
    await current.save();

    const movement = await InventoryMovement.create({
      productId: current._id,
      productCode: current.code || "",
      type: "admin_adjustment",
      quantityDeltaOnHand: delta,
      quantityDeltaReserved: 0,
      channel: "admin",
      referenceId: String(current._id),
      actorId: String(req.user._id),
      reason,
      idempotencyKey: `adj:${current._id}:${Date.now()}:${crypto.randomBytes(4).toString("hex")}`,
    });

    return res.status(200).json({
      success: true,
      product: current,
      movement,
    });
  } catch (error) {
    console.error("adjustStock error:", error);
    return res.status(500).json({ message: "Failed to adjust stock" });
  }
};

export const uploadAdminMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const secureUrl = await uploadImageToCloudinary(req.file);
    await fs.unlink(req.file.path).catch(() => {});

    return res.status(201).json({
      success: true,
      secure_url: secureUrl,
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    console.error("uploadAdminMedia error:", error);
    return res.status(500).json({
      message: error.message || "Media upload failed",
    });
  }
};
