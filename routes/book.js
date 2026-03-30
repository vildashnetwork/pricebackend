import express from "express"
import book from "../models/book.js"

import { sendAdminNotification } from "./sendEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, productId, phone, service, budget, desc } = req.body;

    try {
        const newBook = new book({ name, email, productId, phone, service, budget, desc });
        await newBook.save();

        await sendAdminNotification({
            subject: `🚀 [New Booking] ${service} - ${name}`,
            html: `
            <div style="background-color: #f4f7f9; padding: 40px 10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e8ed;">
                    
                    <div style="background-color: #1a73e8; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">New Booking Received</h1>
                        <p style="color: #e8f0fe; margin: 10px 0 0 0; font-size: 14px;">A new inquiry has been submitted through your website.</p>
                    </div>

                    <div style="padding: 30px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
                            <div style="flex: 1;">
                                <span style="font-size: 12px; font-weight: bold; color: #70757a; text-transform: uppercase;">Service Requested</span>
                                <p style="font-size: 18px; font-weight: bold; color: #1a73e8; margin: 5px 0;">${service}</p>
                            </div>
                            <div style="flex: 1; text-align: right;">
                                <span style="font-size: 12px; font-weight: bold; color: #70757a; text-transform: uppercase;">Est. Budget</span>
                                <p style="font-size: 18px; font-weight: bold; color: #34a853; margin: 5px 0;">${budget}</p>
                            </div>
                        </div>

                        <hr style="border: 0; border-top: 1px solid #e1e8ed; margin: 20px 0;" />

                        <table style="width: 100%; border-spacing: 0; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 10px 0; color: #70757a; font-size: 14px; width: 120px;">Customer:</td>
                                <td style="padding: 10px 0; color: #202124; font-size: 14px; font-weight: 500;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #70757a; font-size: 14px;">Email:</td>
                                <td style="padding: 10px 0; color: #1a73e8; font-size: 14px; font-weight: 500;">
                                    <a href="mailto:${email}" style="color: #1a73e8; text-decoration: none;">${email}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #70757a; font-size: 14px;">Phone:</td>
                                <td style="padding: 10px 0; color: #202124; font-size: 14px; font-weight: 500;">${phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #70757a; font-size: 14px;">Reference ID:</td>
                                <td style="padding: 10px 0; color: #5f6368; font-size: 13px; font-family: monospace;">${productId || 'Direct Inquiry'}</td>
                            </tr>
                        </table>

                        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; border: 1px dashed #dadce0;">
                            <h4 style="margin: 0 0 10px 0; color: #202124; font-size: 14px;">Client Description:</h4>
                            <p style="margin: 0; color: #5f6368; font-size: 14px; line-height: 1.6; font-style: italic;">
                                "${desc}"
                            </p>
                        </div>

                        <div style="text-align: center; margin-top: 30px;">
                            <a href="mailto:${email}" style="background-color: #1a73e8; color: #ffffff; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Reply to Client</a>
                        </div>
                    </div>

                    <div style="background-color: #f1f3f4; padding: 20px; text-align: center; border-top: 1px solid #e1e8ed;">
                        <p style="margin: 0; font-size: 12px; color: #70757a;">This is an automated notification from your Admin Dashboard.</p>
                        <p style="margin: 5px 0 0 0; font-size: 11px; color: #9aa0a6;">© 2026 Your Brand Name. All rights reserved.</p>
                    </div>
                </div>
            </div>
            `
        });

        res.status(200).json({ message: "Booking successful and Admin notified." });

    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// router.post("/", async (req, res) => {
//     const { name, email, productId, phone, service, budget, desc } = req.body
//     try {
//         const newBook = new book({
//             name,
//             email,
//             productId,
//             phone,
//             service,
//             budget,
//             desc
//         })
//         await newBook.save()
//         res.status(200).json({ message: "book created successfully" })
//     } catch (error) {
//         res.status(500).json({ message: "something went wrong" })
//     }
// })

// get all books







router.get("/", async (req, res) => {
    try {
        const books = await book.find().populate("productId")
        res.status(200).json(books)
    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }
})

// puth update book
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, productId, phone, service, budget, desc } = req.body
    try {
        const updatedBook = await book.findByIdAndUpdate(id, {
            name,
            email,
            productId,
            phone,
            service,
            budget,
            desc
        }, { new: true })
        res.status(200).json(updatedBook)
    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }
})

// delete book
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await book.findByIdAndDelete(id)
        res.status(200).json({ message: "book deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }
})

export default router