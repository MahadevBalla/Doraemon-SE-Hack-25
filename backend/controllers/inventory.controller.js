import Inventory from "../models/Inventory.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import Papa from "papaparse";
import { Parser } from "json2csv";
import xlsx from "xlsx";

// Create Inventory
export const createInventory = asyncHandler(async (req, res) => {
  const inventory = new Inventory(req.body);
  await inventory.save();
  res.status(201).json({ message: "Inventory created", inventory });
});

// Get All Inventories
export const getAllInventories = asyncHandler(async (req, res) => {
  const inventories = await Inventory.find(); // optionally populate product & warehouse
  res.status(200).json({ message: "All inventories", inventories });
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

import { createObjectCsvWriter } from "csv-writer";

import Product from "../models/Products.js";
import Warehouse from "../models/Warehouse.js";

export const importInventoryXLSX = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  const filePath = req.file.path;

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Use first sheet
    const sheet = workbook.Sheets[sheetName];

    let jsonData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    // Default demo data
    const defaultWarehouseName = "WH001";
    const defaultProductName = "Paracetamol";

    // Process each row to ensure warehouse and product are mapped correctly
    for (let row of jsonData) {
      if (!row.product || !row.warehouse) {
        throw new Error("Missing product or warehouse in data.");
      }

      // Resolve or create product
      let productDoc = await Product.findOne({ name: row.product });
      if (!productDoc) {
        console.log(`Product not found: ${row.product}. Creating default product.`);
        // Create demo product if missing
        productDoc = await Product.create({ name: defaultProductName });
      }

      // Resolve or create warehouse
      let warehouseDoc = await Warehouse.findOne({ name: row.warehouse });
      if (!warehouseDoc) {
        console.log(`Warehouse not found: ${row.warehouse}. Creating default warehouse.`);
        // Create demo warehouse if missing
        warehouseDoc = await Warehouse.create({ name: defaultWarehouseName });
      }

      // Assign ObjectIds to the product and warehouse fields
      row.product = productDoc._id;
      row.warehouse = warehouseDoc._id;

      // Ensure both fields are set with ObjectIds
      if (!row.product || !row.warehouse) {
        throw new Error(`Product or Warehouse is missing in row: ${JSON.stringify(row)}`);
      }
    }

    // Insert inventory data into the database
    const inserted = await Inventory.insertMany(jsonData);

    res.status(201).json({
      message: "XLSX imported successfully",
      insertedCount: inserted.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "XLSX import failed", error: err.message });
  } finally {
    // Clean up uploaded file
    fs.unlink(filePath, () => {});
  }
});


// GET /api/v1/inventory/export
export const exportInventoryCSV = asyncHandler(async (req, res) => {
  const inventories = await Inventory.find().lean();

  if (!inventories || inventories.length === 0) {
    return res.status(404).json({ message: "No inventory data found to export" });
  }

  try {
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(inventories);

    res.header("Content-Type", "text/csv");
    res.attachment("inventory_export.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "CSV export failed", error: err.message });
  }
});
