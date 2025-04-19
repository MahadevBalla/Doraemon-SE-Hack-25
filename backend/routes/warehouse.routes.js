import { Router } from "express";
import { createWarehouse } from "../controllers/warehouse.controller.js";

const router = Router();

router.route("/create").post(createWarehouse);

export default router;
