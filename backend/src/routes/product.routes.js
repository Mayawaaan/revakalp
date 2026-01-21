import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin
} from '../controllers/product.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { protectAdminRoute } from '../middlewares/admin.middleware.js'; // Import the admin protection middleware
import upload from '../middlewares/upload.middleware.js'; // Import the upload middleware

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/admin', protectRoute, protectAdminRoute, getAllProductsAdmin);
router.get('/:id', getProductById);

// Admin routes (now protected by both general auth and admin-specific auth)
router.post('/', protectRoute, protectAdminRoute, upload.array('image', 10), createProduct); // 'image' is the field name for the array of files, max 10 files
router.put('/:id', protectRoute, protectAdminRoute, upload.array('image', 10), updateProduct); // 'image' is the field name for the array of files, max 10 files
router.delete('/:id', protectRoute, protectAdminRoute, deleteProduct);

export default router;
