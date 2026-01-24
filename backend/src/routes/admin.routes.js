import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { protectAdminRoute } from "../middlewares/admin.middleware.js";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/adminControllers/admin.user.controller.js";
import { createCollection, updateCollection, deleteCollection, getAllCollectionsAdmin } from "../controllers/adminControllers/admin.collection.controller.js";
import { createType, updateType, deleteType, getAllTypes } from "../controllers/adminControllers/admin.type.controller.js";
import { getAnalytics, getRevenueAnalytics, getOrdersByStatus, getUsersAnalytics, getProductsByCategory } from "../controllers/adminControllers/admin.analytics.controller.js";
import { getSettings, updateSettings } from "../controllers/adminControllers/admin.settings.controller.js";
import { createProduct, updateProduct, deleteProduct, getAllProductsAdmin,getAdminProductById} from "../controllers/adminControllers/admin.product.controller.js";
import { getAllOrders, updateOrderStatus } from "../controllers/adminControllers/admin.order.controller.js";
import { createCoupon, updateCoupon, deleteCoupon, getAllCoupons } from "../controllers/adminControllers/admin.coupon.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Example admin route
router.get("/dashboard", protectRoute, protectAdminRoute, (req, res) => {
  res.status(200).json({ message: "Welcome to the admin dashboard!", user: req.user });
});

// Admin user management routes
router.get("/users", protectRoute, protectAdminRoute, getAllUsers);
router.put("/users/:id/role", protectRoute, protectAdminRoute, updateUserRole);
router.delete("/users/:id", protectRoute, protectAdminRoute, deleteUser);

// Admin collection management routes
router.post("/collections", protectRoute, protectAdminRoute, upload.single('image'), createCollection); // 'image' is the field name for the single file
router.put("/collections/:id", protectRoute, protectAdminRoute, upload.single('image'), updateCollection);
router.delete("/collections/:id", protectRoute, protectAdminRoute, deleteCollection);
router.get("/collections", protectRoute, protectAdminRoute, getAllCollectionsAdmin);

// Admin type management routes
router.post("/types", protectRoute, protectAdminRoute, upload.single('image'), createType);
router.put("/types/:id", protectRoute, protectAdminRoute, upload.single('image'), updateType);
router.delete("/types/:id", protectRoute, protectAdminRoute, deleteType);
router.get("/types", protectRoute, protectAdminRoute, getAllTypes);

// Admin analytics route
router.get("/analytics", protectRoute, protectAdminRoute, getAnalytics);
router.get("/analytics/revenue", protectRoute, protectAdminRoute, getRevenueAnalytics);
router.get("/analytics/orders-by-status", protectRoute, protectAdminRoute, getOrdersByStatus);
router.get("/analytics/users", protectRoute, protectAdminRoute, getUsersAnalytics);
router.get("/analytics/products", protectRoute, protectAdminRoute, getProductsByCategory);

// Admin settings routes
router.get("/settings", protectRoute, protectAdminRoute, getSettings);
router.put("/settings", protectRoute, protectAdminRoute, updateSettings);

// Admin product management routes
router.get("/products/", protectRoute, protectAdminRoute, getAllProductsAdmin);
router.get("/products/:id", protectRoute, protectAdminRoute, getAdminProductById);
router.post("/products", protectRoute, protectAdminRoute, upload.array('images', 10), createProduct); // Allow up to 10 images
router.put("/products/:id", protectRoute, protectAdminRoute, upload.array('images', 10), updateProduct);
router.delete("/products/:id", protectRoute, protectAdminRoute, deleteProduct);

// Admin order management routes
router.get("/orders", protectRoute, protectAdminRoute, getAllOrders);
router.put("/orders/:id/status", protectRoute, protectAdminRoute, updateOrderStatus);

// Admin coupon management routes
router.get("/coupons", protectRoute, protectAdminRoute, getAllCoupons);
router.post("/coupons", protectRoute, protectAdminRoute, createCoupon);
router.put("/coupons/:id", protectRoute, protectAdminRoute, updateCoupon);
router.delete("/coupons/:id", protectRoute, protectAdminRoute, deleteCoupon);

export default router;
