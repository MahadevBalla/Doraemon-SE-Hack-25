import express from "express";
import {
  addWarehouse,
  getAllWarehouses,
} from "../controllers/warehouse.controller.js";

const router = express.Router();

router.post("/addWarehouses", addWarehouse); // Add new warehouse
router.get("/getWarehouses", getAllWarehouses); // Get all warehouses

export default router;
