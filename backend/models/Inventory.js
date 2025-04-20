import mongoose from "mongoose";
import Product from "./Products.js";

const InventorySchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

// Validation hook
InventorySchema.pre("save", async function (next) {
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

// Static methods
InventorySchema.statics.syncProduct = async function (productId, quantity) {
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

// In Inventory.js - Ensure this method exists
InventorySchema.statics.addProduct = async function (productId, quantity) {
  return this.findOneAndUpdate(
    {},
    {
      $push: {
        products: {
          product: productId,
          quantity: quantity,
          lastUpdated: new Date(),
        },
      },
    },
    { upsert: true, new: true }
  ).populate("products.product");
};
export default mongoose.models.Inventory ||
  mongoose.model("Inventory", InventorySchema);
