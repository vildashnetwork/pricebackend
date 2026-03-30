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

        // 1. Create the product based on your schema
        const newProduct = await Product.create(req.body);

        // Destructure fields from the newly created product
        const { title, desc, primaryimage, fromprice, toprice, technologies, weblink } = newProduct;

        // 2. Get all UNIQUE customer emails from past bookings
        const uniqueEmails = await Book.distinct("email");

        // 3. Send emails to each unique customer
        if (uniqueEmails.length > 0) {
            try {
                const techList = technologies.join(", "); // Format technologies for the email

                await Promise.all(uniqueEmails.map(custEmail =>
                    sendBrevoEmail({
                        email: custEmail,
                        subject: `🔥 New Arrival: ${title} is now available!`,
                        // Text version to prevent Brevo 400 error
                        text: `New Product Alert: ${title}. Price range: ${fromprice} XAF - ${toprice} XAF. Check it out at ${weblink}`,
                        html: `
                            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; color: #1e293b;">
                                <div style="background-color: #0f172a; padding: 30px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Product Alert</h1>
                                </div>
                                
                                <div style="padding: 24px;">
                                    <img src="${primaryimage}" alt="${title}" style="width: 100%; height: auto; border-radius: 12px; margin-bottom: 20px; object-fit: cover;" />
                                    
                                    <h2 style="color: #0f172a; margin-top: 0;">${title}</h2>
                                    
                                    <div style="background-color: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
                                        <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 600; text-transform: uppercase;">Estimated Pricing</p>
                                        <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 800; color: #059669;">
                                            ${fromprice} XAF — ${toprice} XAF
                                        </p>
                                    </div>

                                    <p style="color: #475569; line-height: 1.6; font-size: 15px;">${desc}</p>
                                    
                                    <div style="margin: 20px 0;">
                                        <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Built with:</p>
                                        <p style="margin: 0; font-size: 14px; color: #334155;">${techList}</p>
                                    </div>

                                    <div style="text-align: center; margin-top: 35px;">
                                        <a href="${weblink}" 
                                           style="background-color: #2563eb; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">
                                            View Project Details
                                        </a>
                                    </div>
                                </div>
                                
                                <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                                    <p style="margin: 0;">You are receiving this because you have previously interacted with our services.</p>
                                </div>
                            </div>
                        `
                    })
                ));
                console.log(`✅ Announcement sent to ${uniqueEmails.length} customers.`);
            } catch (emailErr) {
                console.error("❌ BREVO NOTIFICATION ERROR:");
                console.error(emailErr.response?.data || emailErr.message);
            }
        }

        res.status(201).json({
            success: true,
            message: "Product saved and customers notified",
            data: newProduct
        });

    } catch (error) {
        console.error("❌ CRITICAL SERVER ERROR:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
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