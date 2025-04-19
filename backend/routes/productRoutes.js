// routes/productRoutes.js
import express from 'express';
import { getProducts, createProduct } from '../controllers/productController.js';
import { validateProduct } from '../middlewares/validateProduct.js';

const router = express.Router();

// GET /api/products - Get all products
router.get('/', getProducts);

// POST /api/products - Create new product
router.post('/', validateProduct, createProduct);

export default router;