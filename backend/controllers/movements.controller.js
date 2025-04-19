import Movement from "../models/Movements.js";

// 📦 Create a new movement
export const createMovement = async (req, res) => {
  try {
    const {
      type,
      product,
      fromWarehouse,
      toWarehouse,
      quantity,
      initiatedBy,
      status,
    } = req.body;

    if (!type || !product || !quantity || !initiatedBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newMovement = await Movement.create({
      type,
      product,
      fromWarehouse,
      toWarehouse,
      quantity,
      initiatedBy,
      status,
    });

    res.status(201).json(newMovement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get all movements with optional filters
export const getAllMovements = async (req, res) => {
  try {
    const filters = {};

    if (req.query.product) filters.product = req.query.product;
    if (req.query.type) filters.type = req.query.type;
    if (req.query.status) filters.status = req.query.status;

    const movements = await Movement.find(filters)
      .populate("product fromWarehouse toWarehouse initiatedBy")
      .sort({ createdAt: -1 });

    res.status(200).json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get a specific movement by ID
export const getMovementById = async (req, res) => {
  try {
    const movement = await Movement.findById(req.params.id).populate(
      "product fromWarehouse toWarehouse initiatedBy"
    );

    if (!movement) {
      return res.status(404).json({ message: "Movement not found" });
    }

    res.status(200).json(movement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update movement details (status, etc.)
export const updateMovement = async (req, res) => {
  try {
    const updatedMovement = await Movement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("product fromWarehouse toWarehouse initiatedBy");

    if (!updatedMovement) {
      return res.status(404).json({ message: "Movement not found" });
    }

    res.status(200).json(updatedMovement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete a movement
export const deleteMovement = async (req, res) => {
  try {
    const deletedMovement = await Movement.findByIdAndDelete(req.params.id);
    if (!deletedMovement) {
      return res.status(404).json({ message: "Movement not found" });
    }

    res.status(200).json({ message: "Movement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
