import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { protectAdminRoute } from "../middlewares/admin.middleware.js";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/adminControllers/admin.user.controller.js";
import { createCollection, updateCollection, deleteCollection, getAllCollectionsAdmin } from "../controllers/adminControllers/admin.collection.controller.js";
import { createType, updateType, deleteType, getAllTypes } from "../controllers/adminControllers/admin.type.controller.js";
import {
  getAnalytics,
  getRevenueAnalytics,
  getOrdersByStatus,
  getUsersAnalytics,
  getProductsByCategory,
  getSentimentAnalytics,
  getDeepAnalytics,
} from "../controllers/adminControllers/admin.analytics.controller.js";
import { getSettings, updateSettings } from "../controllers/adminControllers/admin.settings.controller.js";
import { createProduct, updateProduct, deleteProduct, getAllProductsAdmin, getAdminProductById, deleteAllProducts, linkProductColors } from "../controllers/adminControllers/admin.product.controller.js";
import { getAllOrders, getOrderById, updateOrderStatus, recordReturnDecision } from "../controllers/adminControllers/admin.order.controller.js";
import { createCoupon, updateCoupon, deleteCoupon, getAllCoupons } from "../controllers/adminControllers/admin.coupon.controller.js";
import { getInventorySnapshot, recordPosSale, adjustStock, uploadAdminMedia } from "../controllers/adminControllers/admin.inventory.controller.js";
import { getAllCampaignsAdmin, createCampaign, updateCampaign, deleteCampaign } from "../controllers/adminControllers/admin.cms.controller.js";
import { adminGetGrievances, adminUpdateGrievance } from "../controllers/compliance.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/dashboard", protectRoute, protectAdminRoute, (req, res) => {
  res.status(200).json({ message: "Welcome to the admin dashboard!", user: req.user });
});

// Admin user management routes
router.get("/users", protectRoute, protectAdminRoute, getAllUsers);
router.put("/users/:id/role", protectRoute, protectAdminRoute, updateUserRole);
router.delete("/users/:id", protectRoute, protectAdminRoute, deleteUser);

// Admin collection management routes
router.post("/collections", protectRoute, protectAdminRoute, upload.single("image"), createCollection);
router.put("/collections/:id", protectRoute, protectAdminRoute, upload.single("image"), updateCollection);
router.delete("/collections/:id", protectRoute, protectAdminRoute, deleteCollection);
router.get("/collections", protectRoute, protectAdminRoute, getAllCollectionsAdmin);

// Admin type management routes
router.post("/types", protectRoute, protectAdminRoute, upload.single("image"), createType);
router.put("/types/:id", protectRoute, protectAdminRoute, upload.single("image"), updateType);
router.delete("/types/:id", protectRoute, protectAdminRoute, deleteType);
router.get("/types", protectRoute, protectAdminRoute, getAllTypes);

// Admin analytics routes
router.get("/analytics", protectRoute, protectAdminRoute, getAnalytics);
router.get("/analytics/deep", protectRoute, protectAdminRoute, getDeepAnalytics);
router.get("/analytics/revenue", protectRoute, protectAdminRoute, getRevenueAnalytics);
router.get("/analytics/orders-by-status", protectRoute, protectAdminRoute, getOrdersByStatus);
router.get("/analytics/users", protectRoute, protectAdminRoute, getUsersAnalytics);
router.get("/analytics/products", protectRoute, protectAdminRoute, getProductsByCategory);
router.get("/analytics/sentiment", protectRoute, protectAdminRoute, getSentimentAnalytics);

// Admin settings routes
router.get("/settings", protectRoute, protectAdminRoute, getSettings);
router.put("/settings", protectRoute, protectAdminRoute, updateSettings);

// Admin product management routes
router.get("/products/", protectRoute, protectAdminRoute, getAllProductsAdmin);
router.put("/products/link-colors", protectRoute, protectAdminRoute, linkProductColors);
router.get("/products/:id", protectRoute, protectAdminRoute, getAdminProductById);
router.post("/products", protectRoute, protectAdminRoute, upload.array("images", 10), createProduct);
router.put("/products/:id", protectRoute, protectAdminRoute, upload.array("images", 10), updateProduct);
router.delete("/products/:id", protectRoute, protectAdminRoute, deleteProduct);
router.delete("/products", protectRoute, protectAdminRoute, deleteAllProducts);

// Admin inventory ledger & boutique POS routes
router.get("/inventory", protectRoute, protectAdminRoute, getInventorySnapshot);
router.post("/inventory/pos-sale", protectRoute, protectAdminRoute, recordPosSale);
router.put("/inventory/:productId/adjust", protectRoute, protectAdminRoute, adjustStock);

// Secure admin media upload route
router.post("/media/upload", protectRoute, protectAdminRoute, upload.single("image"), uploadAdminMedia);

// Admin CMS campaign routes
router.get("/cms", protectRoute, protectAdminRoute, getAllCampaignsAdmin);
router.post("/cms", protectRoute, protectAdminRoute, createCampaign);
router.put("/cms/:id", protectRoute, protectAdminRoute, updateCampaign);
router.delete("/cms/:id", protectRoute, protectAdminRoute, deleteCampaign);

// Admin order management routes
router.get("/orders", protectRoute, protectAdminRoute, getAllOrders);
router.get("/orders/:id", protectRoute, protectAdminRoute, getOrderById);
router.put("/orders/:id/status", protectRoute, protectAdminRoute, updateOrderStatus);
router.post("/orders/:id/return-decision", protectRoute, protectAdminRoute, recordReturnDecision);

// Admin coupon management routes
router.get("/coupons", protectRoute, protectAdminRoute, getAllCoupons);
router.post("/coupons", protectRoute, protectAdminRoute, createCoupon);
router.put("/coupons/:id", protectRoute, protectAdminRoute, updateCoupon);
router.delete("/coupons/:id", protectRoute, protectAdminRoute, deleteCoupon);

// Admin grievance & compliance log
router.get("/grievances", protectRoute, protectAdminRoute, adminGetGrievances);
router.put("/grievances/:id", protectRoute, protectAdminRoute, adminUpdateGrievance);

export default router;
