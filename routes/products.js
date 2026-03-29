import express from "express";
import Product from "../models/Products.js"; 

const router = express.Router();

// @desc    Create a new product
// @route   POST /
router.post("/", async (req, res) => {
    try {
        // 1. Check if body is empty or has no keys
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Payload cannot be empty" 
            });
        }

        // 2. Create and Save (Using .create is often cleaner than new + .save)
        const newProduct = await Product.create(req.body);

        // 3. Success Response
        res.status(201).json({
            success: true,
            message: "Product saved successfully",
            data: newProduct // Returns the doc with the generated _id
        });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        
        // Handle Validation Errors specifically
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }

        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// @desc    Get all products
// @route   GET /all
router.get("/all", async (req, res) => {
    try {
        const allProducts = await Product.find({}).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: allProducts.length,
            data: allProducts
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ success: false, message: "Could not fetch products" });
    }
});



// @desc    Get a single product by ID
// @route   GET /:id
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        // This catches "CastError" if the ID format is invalid
        res.status(400).json({ success: false, message: "Invalid Product ID" });
    }
});

// @desc    Update a product
// @route   PUT /:id
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // Returns the NEW doc and runs schema checks
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @desc    Delete a product
// @route   DELETE /:id
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get products by category
// @route   GET /category/:categoryName
router.get("/category/:categoryName", async (req, res) => {
    try {
        const { categoryName } = req.params;
        
        // Using a case-insensitive regex search for the category
        const products = await Product.find({ 
            category: { $regex: new RegExp(categoryName, "i") } 
        });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;