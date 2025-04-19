// controllers/productController.js
import Product from '../models/Product.js';

// Get all products
export const getProducts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const products = await Product.find({})
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Product.countDocuments();

        res.status(200).json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new product
export const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        // Handle duplicate SKU error specifically
        if (error.code === 11000 && error.keyPattern.sku) {
            return res.status(400).json({ message: 'SKU must be unique' });
        }
        res.status(400).json({ message: error.message });
    }
};