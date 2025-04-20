// routes/productRoutes.js
import express from "express";
import {
  getProducts,
  createProduct,
  purchaseProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { validateProduct } from "../middlewares/validateProduct.js";

const router = express.Router();

// GET /api/products - Get all products
router.get("/", getProducts);

// POST /api/products - Create new product
router.post("/", validateProduct, createProduct);

// DELETE route for purchases
router.post("/purchase", purchaseProduct);

//Update a product
router.patch("/update/:productName", updateProduct);

//Delete a product
router.delete("/delete/:productName", deleteProduct);
export default router;
