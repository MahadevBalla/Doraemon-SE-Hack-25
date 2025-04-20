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

InventorySchema.statics.adjustStock = async function (
  productId,
  warehouseId,
  quantity,
  adjustmentReason,
  session
) {
  return this.findOneAndUpdate(
    {
      warehouse: warehouseId,
      "products.product": productId,
    },
    {
      $inc: { "products.$.quantity": quantity },
      $set: {
        "products.$.lastUpdated": new Date(),
        "products.$.adjustmentReason": adjustmentReason,
      },
    },
    {
      new: true,
      upsert: true,
      session,
    }
  ).populate("products.product warehouse");
};
const Inventory = mongoose.model("Inventory", InventorySchema);
export default Inventory;
