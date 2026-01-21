import express from 'express';
import {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
} from '../controllers/collection.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { protectAdminRoute } from '../middlewares/admin.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllCollections);
router.get('/:collectionId', getCollectionById);

// Admin routes
router.post('/', protectRoute, protectAdminRoute, createCollection);
router.put('/:collectionId', protectRoute, protectAdminRoute, updateCollection);
router.delete('/:collectionId', protectRoute, protectAdminRoute, deleteCollection);

export default router;
