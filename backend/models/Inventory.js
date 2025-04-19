import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  warehouse: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Warehouse', 
    required: true 
  },
  quantity: { type: Number, required: true, min: 0 },
  allocatedQuantity: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  batchInfo: {
    batchNumber: String,
    expiryDate: Date,
    manufacturingDate: Date,
    supplier: String
  },
  locationInWarehouse: String,
  value: {
    costPrice: Number,
    retailPrice: Number,
    currency: { type: String, default: 'USD' }
  }
}, { timestamps: true });

// Compound index for fast lookups
InventorySchema.index({ product: 1, warehouse: 1 }, { unique: true });

// Static methods
InventorySchema.statics.allocateStock = async function(productId, warehouseId, quantity) {
    if (quantity <= 0) {
        throw new Error('Allocation quantity must be positive');
    }

    const inventory = await this.findOneAndUpdate(
        { product: productId, warehouse: warehouseId },
        { 
            $inc: { allocatedQuantity: quantity },
            $set: { lastUpdated: new Date() }
        },
        { new: true }
    ).populate('product warehouse');

    if (!inventory) {
        throw new Error('Inventory record not found');
    }

    if (inventory.quantity < inventory.allocatedQuantity) {
        throw new Error('Insufficient stock for allocation');
    }

    return inventory;
};

InventorySchema.statics.releaseAllocatedStock = async function(productId, warehouseId, quantity) {
    if (quantity <= 0) {
        throw new Error('Release quantity must be positive');
    }

    const inventory = await this.findOneAndUpdate(
        { product: productId, warehouse: warehouseId },
        { 
            $inc: { allocatedQuantity: -quantity },
            $set: { lastUpdated: new Date() }
        },
        { new: true }
    ).populate('product warehouse');

    if (!inventory) {
        throw new Error('Inventory record not found');
    }

    return inventory;
};

InventorySchema.statics.adjustStock = async function(productId, warehouseId, quantity, adjustmentReason) {
    const inventory = await this.findOneAndUpdate(
        { product: productId, warehouse: warehouseId },
        { 
            $inc: { quantity: quantity },
            $set: { lastUpdated: new Date() }
        },
        { new: true, upsert: true }
    ).populate('product warehouse');

    return inventory;
};
export const Inventory = mongoose.model('Inventory', InventorySchema);