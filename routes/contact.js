import express from "express"
import axios from "axios"
import contact from "../models/Contact.js"
import { sendAdminNotification } from "./sendEmail.js"
const router = express.Router()



router.post("/", async (req, res) => {
    const { name, email, subject, desc } = req.body
    try {
        const newcontact = new contact({
            name,
            email,
            subject,
            desc
        })
        await newcontact.save()

        // Trigger the professional admin email
        await sendAdminNotification({
            subject: `✉️ [New Message] ${subject} - ${name}`,
            html: `
            <div style="background-color: #f0f2f5; padding: 40px 10px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    
                    <div style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 35px; text-align: center;">
                        <div style="background-color: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                            <span style="font-size: 30px;">✉️</span>
                        </div>
                        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">New Contact Inquiry</h1>
                    </div>

                    <div style="padding: 40px;">
                        <div style="margin-bottom: 30px;">
                            <span style="font-size: 11px; font-weight: 800; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px;">Subject</span>
                            <h2 style="font-size: 20px; color: #18181b; margin: 5px 0 0 0;">${subject}</h2>
                        </div>

                        <div style="background-color: #fafafa; border-radius: 12px; padding: 25px; border: 1px solid #f1f1f1;">
                            <div style="margin-bottom: 20px;">
                                <p style="margin: 0; font-size: 13px; color: #71717a;">From</p>
                                <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #18181b;">${name}</p>
                                <p style="margin: 2px 0 0 0; font-size: 14px; color: #4f46e5;">${email}</p>
                            </div>

                            <hr style="border: 0; border-top: 1px solid #e5e5e7; margin: 20px 0;" />

                            <div>
                                <p style="margin: 0; font-size: 13px; color: #71717a;">Message Content</p>
                                <p style="margin: 10px 0 0 0; font-size: 15px; color: #3f3f46; line-height: 1.6; white-space: pre-wrap;">${desc}</p>
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 35px;">
                            <a href="mailto:${email}?subject=Re: ${subject}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 30px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
                                Quick Reply
                            </a>
                        </div>
                    </div>

                    <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
                        <p style="margin: 0; font-size: 12px; color: #94a3b8;">Sent via Contact Form on Your Website</p>
                    </div>
                </div>
            </div>
            `
        });

        res.status(200).json("message sent successfully")
    }
    catch (err) {
        res.status(500).json(err)
    }
})
// router.post("/", async (req, res) => {
//     const { name, email, subject, desc } = req.body
//     try {
//         const newcontact = new contact({
//             name,
//             email,
//             subject,
//             desc
//         })
//         await newcontact.save()
//         res.status(200).json("message sent successfully")
//     }
//     catch (err) {
//         res.status(500).json(err)
//     }
// })

//delete by id
router.delete("/:id", async (req, res) => {
    try {
        await contact.findByIdAndDelete(req.params.id)
        res.status(200).json("message deleted successfully")
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//get all messages
router.get("/", async (req, res) => {
    try {
        const messages = await contact.find()
        res.status(200).json(messages)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//get message by id
router.get("/:id", async (req, res) => {
    try {
        const message = await contact.findById(req.params.id)
        res.status(200).json(message)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

export default router;
