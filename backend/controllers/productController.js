import Product from "../models/Products.js";
import Inventory from "../models/Inventory.js";
import mongoose from "mongoose";
import Warehouse from "../models/Warehouse.js";
// import generate from "../utils/barcodeGenAPI.js";
// import { handleMovement } from '../utils/handleMovement.js';

// Get all products
export const getProducts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const products = await Product.find({})
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments();

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product
// Create Product
// Create Product
// In productController.js - createProduct function
export const createProduct = async (req, res) => {
  try {
    const { name, warehouseName, stock, ...otherFields } = req.body;

    // Validate warehouse exists
    const warehouse = await Warehouse.findOne({
      name: decodeURIComponent(warehouseName.replace(/\+/g, " ")),
    });
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    // Existing product logic
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      existingProduct.stock += Number(stock) || 1;
      await existingProduct.save();

      // Correct parameter order: warehouseId, productId, quantity
      await Warehouse.addProduct(
        warehouse._id, // Warehouse ID
        existingProduct._id, // Product ID
        existingProduct.stock // Numeric quantity
      );

      return res.status(200).json(existingProduct);
    }

    // New product logic
    const product = new Product({
      name,
      warehouse: warehouse._id,
      stock: stock || 0,
      ...otherFields,
    });

    const savedProduct = await product.save();

    // Correct parameter order: warehouseId, productId, quantity
    await Warehouse.addProduct(
      warehouse._id, // Warehouse ID
      savedProduct._id, // Product ID
      savedProduct.stock // Numeric quantity
    );

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({
      message: "Product creation failed",
      error: error.message,
    });
  }
}; // Update Product
export const updateProduct = async (req, res) => {
  try {
    const { productName } = req.params;
    const updates = req.body;

    // Find product
    const product = await Product.findOne({
      name: decodeURIComponent(productName.replace(/\+/g, " ")),
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Track original values
    const originalStock = product.stock;
    const originalWarehouseId = product.warehouse;

    // Validate updates
    if (updates.name) {
      const existing = await Product.findOne({ name: updates.name });
      if (existing) throw new Error("Product name exists");
      product.name = updates.name;
    }

    // Handle warehouse change
    let newWarehouseId = originalWarehouseId;
    if (updates.warehouseName) {
      const newWarehouse = await Warehouse.findOne({
        name: updates.warehouseName,
      });
      if (!newWarehouse) throw new Error("New warehouse not found");
      newWarehouseId = newWarehouse._id;
      product.warehouse = newWarehouseId;
    }

    // Update other fields
    const updatableFields = [
      "description",
      "category",
      "unit",
      "minStockLevel",
      "isPerishable",
      "defaultExpiryDays",
      "stock",
    ];
    updatableFields.forEach((field) => {
      if (updates[field] !== undefined) {
        product[field] = updates[field];
      }
    });

    // Calculate stock delta
    const stockDelta =
      updates.stock !== undefined ? Number(updates.stock) - originalStock : 0;

    // Save product changes
    const updatedProduct = await product.save();

    // Sync inventory and warehouse if stock changed
    if (stockDelta !== 0) {
      // Update Inventory
      await Inventory.adjustStock(
        updatedProduct._id,
        updatedProduct.warehouse,
        stockDelta,
        "stock-adjustment"
      );

      // Update Warehouse
      await Warehouse.adjustProductQuantity(
        updatedProduct.warehouse,
        updatedProduct._id,
        stockDelta
      );
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({
      message: "Update failed",
      error: error.message,
    });
  }
};
// Update Product
// Delete product
export const deleteProduct = async (req, res) => {
  try {
    console.log("req.params:", req.params);
    const { productName } = req.params;
    const updates = req.body;

    console.log("Raw productName:", productName);
    const decodedName = decodeURIComponent(productName.replace(/\+/g, " "));
    console.log("Decoded productName:", decodedName);

    // Find product using case-insensitive search
    const product = await Product.findOne({
      name: { $regex: new RegExp(`^${decodedName}$`, "i") },
    });

    if (!product) {
      console.log("No product found for:", decodedName);
      return res.status(404).json({ message: "Product not found" });
    }

    // Name uniqueness check
    // if (updates.name && updates.name !== product.name) {
    //   const existingProduct = await Product.findOne({
    //     name: { $regex: new RegExp(`^${updates.name}$`, "i") },
    //   });

    //   if (existingProduct) {
    //     return res.status(409).json({
    //       message: "Product name already exists",
    //       solution: "Use a different product name or keep the original",
    //     });
    //   }
    //   product.name = updates.name;
    // }
    // Modified stock handling
    // const updatableFields = [
    //   "description",
    //   "category",
    //   "unit",
    //   "minStockLevel",
    //   "isPerishable",
    //   "defaultExpiryDays",
    //   "warehouse",
    // ];

    // Handle stock increment separately
    if (updates.stock !== undefined) {
      product.stock -= Number(updates.stock);
    } else {
      product.stock--;
    }
    // Update other fields
    // updatableFields.forEach((field) => {
    //   if (updates[field] !== undefined) {
    //     product[field] = updates[field];
    //   }
    // });

    // Warehouse validation (unchanged)
    if (updates.warehouse) {
      const warehouseExists = await Warehouse.exists({
        _id: updates.warehouse,
      });
      if (!warehouseExists) {
        return res.status(400).json({
          message: "Invalid warehouse reference",
          solution: "Provide a valid warehouse ID",
        });
      }
    }

    await product.validate();
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    // Error handling (unchanged)
  }
};

// Purchase product (as you already have)
export const purchaseProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId, quantity, warehouseId } = req.body;

    const inventory = await Inventory.findOne({
      product: productId,
      warehouse: warehouseId,
    });
    if (!inventory || inventory.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    await handleMovement({
      type: "sale",
      product: productId,
      quantity,
      fromWarehouse: warehouseId,
      initiatedBy: req.user.id,
      session,
    });

    await session.commitTransaction();
    res.status(200).json({ message: "Product purchased successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
