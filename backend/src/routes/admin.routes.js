import express from "express";
import { protectAdminRoute } from "../middlewares/admin.middleware.js";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/admin.user.controller.js";
import { createCollection, updateCollection, deleteCollection, getAllCollectionsAdmin } from "../controllers/admin.collection.controller.js";
import { createType, updateType, deleteType, getAllTypes } from "../controllers/admin.type.controller.js";
import { getAnalytics, getRevenueAnalytics, getOrdersByStatus, getUsersAnalytics, getProductsByCategory } from "../controllers/admin.analytics.controller.js";
import { getSettings, updateSettings } from "../controllers/admin.settings.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Example admin route
router.get("/dashboard", protectAdminRoute, (req, res) => {
  res.status(200).json({ message: "Welcome to the admin dashboard!", user: req.user });
});

// Admin user management routes
router.get("/users", protectAdminRoute, getAllUsers);
router.put("/users/:id/role", protectAdminRoute, updateUserRole);
router.delete("/users/:id", protectAdminRoute, deleteUser);

// Admin collection management routes
router.post("/collections", protectAdminRoute, upload.single('image'), createCollection); // 'image' is the field name for the single file
router.put("/collections/:id", protectAdminRoute, upload.single('image'), updateCollection);
router.delete("/collections/:id", protectAdminRoute, deleteCollection);
router.get("/collections", protectAdminRoute, getAllCollectionsAdmin);

// Admin type management routes
router.post("/types", protectAdminRoute, upload.single('image'), createType);
router.put("/types/:id", protectAdminRoute, upload.single('image'), updateType);
router.delete("/types/:id", protectAdminRoute, deleteType);
router.get("/types", protectAdminRoute, getAllTypes);

// Admin analytics route
router.get("/analytics", protectAdminRoute, getAnalytics);
router.get("/analytics/revenue", protectAdminRoute, getRevenueAnalytics);
router.get("/analytics/orders-by-status", protectAdminRoute, getOrdersByStatus);
router.get("/analytics/users", protectAdminRoute, getUsersAnalytics);
router.get("/analytics/products", protectAdminRoute, getProductsByCategory);

// Admin settings routes
router.get("/settings", protectAdminRoute, getSettings);
router.put("/settings", protectAdminRoute, updateSettings);

export default router;
