// controllers/movementController.js
import Movement from '../models/Movements.js';
import Inventory from '../models/Inventory.js';
import Product from '../models/Products.js';
import Alert from '../models/Alerts.js';
import mongoose from 'mongoose';

// Middleware: Validate movement constraints
export const validateMovement = async (req, res, next) => {
  const { type, product, quantity, fromWarehouse, toWarehouse } = req.body;

  if (!['purchase', 'sale', 'transfer', 'return', 'adjustment', 'write-off'].includes(type)) {
    return res.status(400).json({ message: 'Invalid movement type' });
  }

  const productExists = await Product.exists({ _id: product });
  if (!productExists) return res.status(404).json({ message: 'Product not found' });

  switch(type) {
    case 'transfer':
      if (!fromWarehouse || !toWarehouse) {
        return res.status(400).json({ message: 'Both from and to warehouses required for transfers' });
      }
      break;

    case 'sale':
      if (!fromWarehouse) {
        return res.status(400).json({ message: 'From warehouse required for sales' });
      }
      const currentStock = await Inventory.findOne({ product, warehouse: fromWarehouse });
      if ((currentStock?.quantity || 0) < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      break;

    case 'purchase':
      if (!toWarehouse) {
        return res.status(400).json({ message: 'To warehouse required for purchases' });
      }
      break;
  }

  next();
};

// Controller: Create movement
export const createMovement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const movement = new Movements({
      ...req.body,
      status: 'completed',
      initiatedBy: req.user.id
    });

    await movement.save({ session });

    switch(movement.type) {
      case 'purchase':
        await Inventory.updateOne(
          { product: movement.product, warehouse: movement.toWarehouse },
          { $inc: { quantity: movement.quantity } },
          { session, upsert: true }
        );
        break;

      case 'sale':
        await Inventory.updateOne(
          { product: movement.product, warehouse: movement.fromWarehouse },
          { $inc: { quantity: -movement.quantity } },
          { session }
        );
        break;

      case 'transfer':
        await Promise.all([
          Inventory.updateOne(
            { product: movement.product, warehouse: movement.fromWarehouse },
            { $inc: { quantity: -movement.quantity } },
            { session }
          ),
          Inventory.updateOne(
            { product: movement.product, warehouse: movement.toWarehouse },
            { $inc: { quantity: movement.quantity } },
            { session, upsert: true }
          )
        ]);
        break;
    }

    // Stock alert check after movement
    const updatedInventory = await Inventory.findOne({
      product: movement.product,
      warehouse: movement.fromWarehouse
    });

    const productInfo = await Product.findById(movement.product);

    if (updatedInventory?.quantity < (productInfo.minStockLevel || 0)) {
      await Alert.create({
        type: 'low-stock',
        product: movement.product,
        warehouse: movement.fromWarehouse,
        threshold: productInfo.minStockLevel,
        currentValue: updatedInventory.quantity,
        severity: 'high',
        status: 'active'
      });
    }

    await session.commitTransaction();
    res.status(201).json(movement);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// Controller: Get filtered movements
export const getMovements = async (req, res) => {
  try {
    const { type, product, warehouse, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (product) filter.product = product;
    if (warehouse) {
      filter.$or = [
        { fromWarehouse: warehouse },
        { toWarehouse: warehouse }
      ];
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const movements = await Movements.find(filter)
      .populate('product', 'name sku')
      .populate('fromWarehouse toWarehouse', 'name location')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Movements.countDocuments(filter);

    res.json({
      movements,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Reverse movement
export const reverseMovement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const original = await Movements.findById(req.params.id);
    if (!original) return res.status(404).json({ message: 'Movement not found' });
    if (original.status === 'reversed') {
      return res.status(400).json({ message: 'Movement already reversed' });
    }

    const reversal = new Movements({
      ...original.toObject(),
      _id: undefined,
      reversalOf: original._id,
      status: 'reversed',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await reversal.save({ session });

    switch(original.type) {
      case 'purchase':
        await Inventory.updateOne(
          { product: original.product, warehouse: original.toWarehouse },
          { $inc: { quantity: -original.quantity } },
          { session }
        );
        break;

      case 'sale':
        await Inventory.updateOne(
          { product: original.product, warehouse: original.fromWarehouse },
          { $inc: { quantity: original.quantity } },
          { session }
        );
        break;

      case 'transfer':
        await Promise.all([
          Inventory.updateOne(
            { product: original.product, warehouse: original.fromWarehouse },
            { $inc: { quantity: original.quantity } },
            { session }
          ),
          Inventory.updateOne(
            { product: original.product, warehouse: original.toWarehouse },
            { $inc: { quantity: -original.quantity } },
            { session }
          )
        ]);
        break;
    }

    original.status = 'reversed';
    await original.save({ session });

    await session.commitTransaction();
    res.json(reversal);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
