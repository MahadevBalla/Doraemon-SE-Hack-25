import Product from "./Products.js";
import mongoose from "mongoose";
const WarehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
          unique: true, // Ensures one entry per product
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
        lastUpdated: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    location: {
      address: String,
      city: String,
      // state: String,
      // country: String,
      postalCode: String,
      // coordinates: { type: [Number], index: '2dsphere' }
    },
    quantity: {
      type: Number,
      default: 0,
    },
    capacity: Number,
    currentOccupancy: Number,
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // isActive: { type: Boolean, default: true },
    // contact: {
    //     phone: String,
    //     email: String
    // }
  },
  { timestamps: true }
);
WarehouseSchema.pre("save", async function (next) {
  for (const item of this.products) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new Error(`Product ${item.product} not found`));
    }
    if (item.quantity < product.minStockLevel) {
      return next(
        new Error(
          `Quantity for ${product.name} cannot be below minimum stock level of ${product.minStockLevel}`
        )
      );
    }
  }
  next();
});
WarehouseSchema.statics.syncProduct = async function (productId, quantity) {
  return this.findOneAndUpdate(
    { "products.product": productId },
    {
      $set: {
        "products.$.quantity": quantity,
        "products.$.lastUpdated": new Date(),
      },
    },
    { new: true }
  ).populate("products.product");
};
// In Warehouse.js
WarehouseSchema.statics.addProduct = async function (
  warehouseId,
  productId,
  quantity
) {
  // Validate input types
  if (!mongoose.Types.ObjectId.isValid(warehouseId)) {
    throw new Error("Invalid warehouse ID");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  // Force numeric conversion
  const numericQuantity = Number(quantity);
  if (isNaN(numericQuantity)) {
    throw new Error("Quantity must be a number");
  }

  return this.findByIdAndUpdate(
    warehouseId,
    {
      $push: {
        products: {
          product: productId,
          quantity: numericQuantity,
        },
      },
      $inc: { quantity: numericQuantity },
    },
    { new: true, upsert: true }
  ).populate("products.product");
};

const Warehouse =
  mongoose.models.Warehouse || mongoose.model("Warehouse", WarehouseSchema);
export default Warehouse;
