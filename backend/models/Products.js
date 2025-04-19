import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    category: { type: String, index: true },
    unit: { type: String, enum: ['piece', 'kg', 'liter', 'box'], default: 'piece' },
    barcode: String,
    manufacturer: String,
    minStockLevel: Number,
    isPerishable: Boolean,
    defaultExpiryDays: Number,
    attributes: mongoose.Schema.Types.Mixed,
    imageUrl: String,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
const Product = mongoose.model('Product', ProductSchema);
export default Product;