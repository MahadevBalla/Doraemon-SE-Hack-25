import mongoose from "mongoose";

const MovementSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['purchase', 'sale', 'transfer', 'return', 'adjustment', 'write-off'],
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    fromWarehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: function() {
            return ['sale', 'transfer', 'adjustment', 'write-off'].includes(this.type);
        }
    },
    toWarehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: function() {
            return ['purchase', 'transfer', 'return'].includes(this.type);
        }
    },
    quantity: { 
        type: Number, 
        required: true,
        validate: {
            validator: function(v) {
                const type = this.type;
                if (['purchase', 'sale', 'transfer', 'return', 'write-off'].includes(type)) {
                    return v > 0;
                }
                return true; // Allow any number for adjustments
            },
            message: 'Quantity must be positive for this movement type.'
        }
    },
    // ... other fields remain unchanged
}, { timestamps: true });

// Pre-save hook to update Inventory
MovementSchema.pre('save', async function (next) {
    if (this.status !== 'completed') return next();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        switch (this.type) {
            case 'purchase':
                await Inventory.findOneAndUpdate(
                    { product: this.product, warehouse: this.toWarehouse },
                    { $inc: { quantity: this.quantity } },
                    { upsert: true, session }
                );
                break;
            case 'sale':
                await Inventory.findOneAndUpdate(
                    { product: this.product, warehouse: this.fromWarehouse },
                    { $inc: { quantity: -this.quantity } },
                    { session }
                );
                break;
            case 'transfer':
                await Inventory.findOneAndUpdate(
                    { product: this.product, warehouse: this.fromWarehouse },
                    { $inc: { quantity: -this.quantity } },
                    { session }
                );
                await Inventory.findOneAndUpdate(
                    { product: this.product, warehouse: this.toWarehouse },
                    { $inc: { quantity: this.quantity } },
                    { upsert: true, session }
                );
                break;
            case 'adjustment':
                await Inventory.findOneAndUpdate(
                    { product: this.product, warehouse: this.fromWarehouse },
                    { $inc: { quantity: this.quantity } },
                    { session }
                );
                break;
            case 'return':
                await Inventory.findOneAndUpdate(
                    { product: this.product, warehouse: this.toWarehouse },
                    { $inc: { quantity: this.quantity } },
                    { upsert: true, session }
                );
                break;
            case 'write-off':
                await Inventory.findOneAndUpdate(
                    { product: this.product, warehouse: this.fromWarehouse },
                    { $inc: { quantity: -this.quantity } },
                    { session }
                );
                break;
            default:
                throw new Error('Invalid movement type');
        }
        await session.commitTransaction();
        next();
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
});

// Post-save hook to generate alerts
MovementSchema.post('save', async function (doc, next) {
    if (doc.status !== 'completed') return next();

    try {
        const warehouses = [];
        if (doc.toWarehouse) warehouses.push(doc.toWarehouse);
        if (doc.fromWarehouse) warehouses.push(doc.fromWarehouse);

        for (const warehouseId of warehouses) {
            const inventory = await Inventory.findOne({ 
                product: doc.product, 
                warehouse: warehouseId 
            }).populate('product');

            if (!inventory || !inventory.product) continue;

            // Low-stock alert
            if (inventory.product.minStockLevel && inventory.quantity < inventory.product.minStockLevel) {
                await Alert.updateOne(
                    { product: doc.product, warehouse: warehouseId, type: 'low-stock', status: 'active' },
                    { $set: { currentValue: inventory.quantity } },
                    { upsert: true }
                );
            }

            // Expiry alert
            if (inventory.product.isPerishable && inventory.batchInfo?.expiryDate) {
                const expiryDate = new Date(inventory.batchInfo.expiryDate);
                const daysUntilExpiry = Math.ceil((expiryDate - Date.now()) / (86400000));
                if (daysUntilExpiry <= 30) {
                    await Alert.updateOne(
                        { product: doc.product, warehouse: warehouseId, type: 'expiry', status: 'active' },
                        { $set: { currentValue: daysUntilExpiry } },
                        { upsert: true }
                    );
                }
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

// ... indexes and export
MovementSchema.index({ product: 1, createdAt: 1 });
MovementSchema.index({ type: 1, createdAt: 1 });
MovementSchema.index({ initiatedBy: 1, createdAt: 1 });

const Movements = mongoose.model("Movements", MovementSchema);

export default Movements;