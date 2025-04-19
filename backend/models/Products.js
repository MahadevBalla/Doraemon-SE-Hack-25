import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema(
  {
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    stock: { type: Number, default: 0 },
    // sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    category: { type: String, index: true },
    unit: { type: String, enum: ["piece", "box"], default: "piece" },
    barcode: {
      type: String,
      unique: true,
      index: true,
      validate: {
        validator: function (v) {
          // Updated regex to match Code128 + Base64 requirements
          return /^[A-Za-z0-9\-_*$%+.\/=]+$/.test(v) && v.length <= 30;
        },
        message: "Invalid barcode format",
      },
    },
    // manufacturer: String,
    minStockLevel: Number,
    isPerishable: Boolean,
    defaultExpiryDays: Number,
    // attributes: mongoose.Schema.Types.Mixed,
    // imageUrl: String,
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", ProductSchema);
export default Product;
