import express from "express";
import Product from "../models/Products.js";
import Book from "../models/book.js"; // Import your booking model
import { sendBrevoEmail } from "./sendEmail.js";
const router = express.Router();

// @desc    Create a new product
// @route   POST /
// router.post("/", async (req, res) => {
//     try {
//         // 1. Check if body is empty or has no keys
//         if (!req.body || Object.keys(req.body).length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Payload cannot be empty"
//             });
//         }

//         // 2. Create and Save (Using .create is often cleaner than new + .save)
//         const newProduct = await Product.create(req.body);

//         // 3. Success Response
//         res.status(201).json({
//             success: true,
//             message: "Product saved successfully",
//             data: newProduct // Returns the doc with the generated _id
//         });

//     } catch (error) {
//         console.error(`Error: ${error.message}`);

//         // Handle Validation Errors specifically
//         if (error.name === 'ValidationError') {
//             return res.status(400).json({ success: false, message: error.message });
//         }

//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// });




router.post("/", async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: "Payload cannot be empty" });
        }

        // 1. Create the product
        const newProduct = await Product.create(req.body);
        const { title, price, desc, img } = newProduct;

        // 2. Get all UNIQUE customer emails from past bookings
        // .distinct("email") returns an array of unique strings: ["user1@gmail.com", "user2@gmail.com"]
        const uniqueEmails = await Book.distinct("email");

        // 3. Send emails to each unique customer
        if (uniqueEmails.length > 0) {
            // We use Promise.all to send them efficiently
            await Promise.all(uniqueEmails.map(custEmail =>
                sendBrevoEmail({
                    email: custEmail,
                    subject: `🔥 New Arrival: ${title} is now available!`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 15px; overflow: hidden;">
                            <div style="background-color: #000; padding: 20px; text-align: center;">
                                <h1 style="color: #fff; margin: 0;">New Product Alert</h1>
                            </div>
                            
                            <div style="padding: 20px;">
                                <img src="${img}" alt="${title}" style="width: 100%; border-radius: 10px; margin-bottom: 20px;" />
                                <h2 style="color: #333;">${title}</h2>
                                <p style="font-size: 18px; font-weight: bold; color: #1a73e8;">Price: ${price}</p>
                                <p style="color: #666; line-height: 1.6;">${desc}</p>
                                
                                <div style="text-align: center; margin-top: 30px;">
                                    <a href="https://vildashprice.vizit.homes/services" 
                                       style="background-color: #1a73e8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                       View Product Now
                                    </a>
                                </div>
                            </div>
                            
                            <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                                <p>You are receiving this because you have booked with us before.</p>
                            </div>
                        </div>
                    `
                })
            ));
            console.log(`Announcement sent to ${uniqueEmails.length} unique customers.`);
        }

        res.status(201).json({
            success: true,
            message: "Product saved and customers notified",
            data: newProduct
        });

    } catch (error) {
        console.error(`Error: ${error.message}`);
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