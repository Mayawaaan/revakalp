import express from 'express';
import { getTypesByCategory } from '../controllers/type.controller.js';

const router = express.Router();

router.get('/:category', getTypesByCategory);

export default router;
