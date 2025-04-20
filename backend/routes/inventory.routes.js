import { Router } from "express";
import {
  createInventory,
  getAllInventories,
  updateInventory,
  deleteInventory,
  allocateStock,
  releaseStock,
  adjustStock,
  importInventoryXLSX,
  exportInventoryCSV
} from "../controllers/inventory.controller.js";
import { upload } from "../middlewares/uploadMiddleware.js";



const router = Router();

// CRUD Routes
router.post("/", createInventory);
router.get("/", getAllInventories);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

// Inventory Actions
router.post("/allocate", allocateStock);
router.post("/release", releaseStock);
router.post("/adjust", adjustStock);

router.post("/import/xlsx", upload.single("file"), importInventoryXLSX);
router.get("/export", exportInventoryCSV);


export default router;
