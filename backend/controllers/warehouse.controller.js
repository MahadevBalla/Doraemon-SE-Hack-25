import {asyncHandler} from "../utils/asyncHandler.js";
import Warehouse from "../models/Warehouse.js";

export const createWarehouse = asyncHandler(async (req, res) => {
    const {
        name,
        location,
        capacity,
        currentOccupancy,
        contact
    } = req.body;

    if (!name || !location) {
        return res.status(400).json({ message: "Required fields are missing" });
    }

    const warehouse = await Warehouse.create({
        name,
        location,
        capacity,
        currentOccupancy,
        contact
    });

    res.status(201).json({
        success: true,
        message: "Warehouse created successfully",
        warehouse
    });
});
