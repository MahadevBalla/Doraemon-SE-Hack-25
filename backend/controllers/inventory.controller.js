import Inventory from "../models/Inventory.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Inventory
export const createInventory = asyncHandler(async (req, res) => {
  const inventory = new Inventory(req.body);
  await inventory.save();
  res.status(201).json({ message: "Inventory created", inventory });
});

// Get All Inventories
export const getAllInventories = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findOne({}).populate({
    path: "products.product",
    select: "name stock minStockLevel category unit warehouse",
  });

  if (!inventory) return res.status(200).json({ products: [] });

  res.status(200).json({
    products: inventory.products.map((p) => ({
      product: p.product,
      quantity: p.quantity,
      lastUpdated: p.lastUpdated,
    })),
  });
});

// Update Inventory
export const updateInventory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const inventory = await Inventory.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!inventory) {
    return res.status(404).json({ message: "Inventory not found" });
  }

  res.status(200).json({ message: "Inventory updated", inventory });
});

// Delete Inventory
export const deleteInventory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const inventory = await Inventory.findByIdAndDelete(id);

  if (!inventory) {
    return res.status(404).json({ message: "Inventory not found" });
  }

  res.status(200).json({ message: "Inventory deleted", inventory });
});

// Allocate Stock
export const allocateStock = asyncHandler(async (req, res) => {
  const { productId, warehouseId, quantity } = req.body;

  const inventory = await Inventory.allocateStock(
    productId,
    warehouseId,
    quantity
  );
  res.status(200).json({ message: "Stock allocated", inventory });
});

// Release Allocated Stock
export const releaseStock = asyncHandler(async (req, res) => {
  const { productId, warehouseId, quantity } = req.body;

  const inventory = await Inventory.releaseAllocatedStock(
    productId,
    warehouseId,
    quantity
  );
  res.status(200).json({ message: "Allocated stock released", inventory });
});

// Adjust Stock
export const adjustStock = asyncHandler(async (req, res) => {
  const { productId, warehouseId, quantity, reason } = req.body;

  const inventory = await Inventory.adjustStock(
    productId,
    warehouseId,
    quantity,
    reason
  );
  res.status(200).json({ message: "Stock adjusted", inventory });
});
