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
  allocatedQuantity: { type: Number, default: 0 }, // For reservations
  lastUpdated: { type: Date, default: Date.now },
  batchInfo: {
    batchNumber: String,
    expiryDate: Date,
    manufacturingDate: Date,
    supplier: String
  },
  locationInWarehouse: String,
  value: { // For inventory valuation
    costPrice: Number,
    retailPrice: Number,
    currency: { type: String, default: 'USD' }
  }
}, { timestamps: true });

// Compound index for fast lookups
InventorySchema.index({ product: 1, warehouse: 1 }, { unique: true });

const Inventory = mongoose.model("Inventory", InventorySchema);
export default Inventory;