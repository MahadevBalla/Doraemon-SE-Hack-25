import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'manager', 'staff'],
        required: true
    },
    warehouses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse'
    }],
    lastLogin: Date,
    isActive: { type: Boolean, default: true },
    refreshTokens: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
}, { timestamps: true });
const User = mongoose("User", UserSchema);
export default User;