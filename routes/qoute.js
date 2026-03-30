import qoute from "../models/Qoutes.js"
import express from "express"

import { sendBrevoEmail } from "./sendEmail.js"

const router = express.Router()

// router.post("/", async (req, res) => {
//     const { name, email, number, company, services, budget, timeline, desc } = req.body
//     try {
//         const newqoute = new qoute({
//             name,
//             email,
//             number,
//             company,
//             services,
//             budget,
//             timeline,
//             desc
//         })
//         await newqoute.save()
//         res.status(200).json("qoute request sent successfully")
//     }
//     catch (err) {
//         res.status(500).json(err)
//     }
// })

//delete by id







router.post("/", async (req, res) => {
    const { name, email, number, company, services, budget, timeline, desc } = req.body
    try {
        const newqoute = new qoute({
            name,
            email,
            number,
            company,
            services,
            budget,
            timeline,
            desc
        })
        await newqoute.save()

        // Trigger Professional Quote Notification
        await sendBrevoEmail({
            subject: `💎 [New Quote Request] ${company || name} - ${budget}`,
            html: `
            <div style="background-color: #f8fafc; padding: 40px 10px; font-family: 'Inter', -apple-system, sans-serif;">
                <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
                    
                    <div style="background-color: #0f172a; padding: 30px; text-align: left;">
                        <span style="background-color: #38bdf8; color: #0f172a; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase;">New Business Lead</span>
                        <h1 style="color: #ffffff; margin: 15px 0 0 0; font-size: 24px; font-weight: 700;">Project Quote Request</h1>
                    </div>

                    <div style="padding: 30px; background-color: #f1f5f9;">
                        <div style="display: grid; gap: 20px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="width: 50%; padding: 10px; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;">
                                        <p style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">Target Budget</p>
                                        <p style="margin: 5px 0 0 0; font-size: 18px; color: #059669; font-weight: 700;">${budget}</p>
                                    </td>
                                    <td style="width: 4%;">&nbsp;</td>
                                    <td style="width: 50%; padding: 10px; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;">
                                        <p style="margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">Expected Timeline</p>
                                        <p style="margin: 5px 0 0 0; font-size: 18px; color: #0f172a; font-weight: 700;">${timeline}</p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <div style="padding: 30px;">
                        <h3 style="font-size: 14px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px;">Contact Information</h3>
                        <table style="width: 100%; font-size: 14px; color: #475569; line-height: 2;">
                            <tr>
                                <td style="width: 120px; font-weight: 600;">Client:</td>
                                <td style="color: #0f172a;">${name}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600;">Company:</td>
                                <td style="color: #0f172a;">${company || 'Personal Project'}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600;">Email:</td>
                                <td><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none; font-weight: 600;">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600;">Phone:</td>
                                <td style="color: #0f172a;">${number}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600;">Services:</td>
                                <td><span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${Array.isArray(services) ? services.join(', ') : services}</span></td>
                            </tr>
                        </table>

                        <h3 style="font-size: 14px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px; margin-bottom: 15px;">Project Brief</h3>
                        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; color: #334155; font-size: 15px; line-height: 1.6;">
                            ${desc}
                        </div>

                        <div style="text-align: center; margin-top: 40px;">
                            <a href="mailto:${email}?subject=Project Discussion: ${services}" style="background-color: #0f172a; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block;">
                                Initiate Discussion
                            </a>
                        </div>
                    </div>

                    <div style="background-color: #f1f5f9; padding: 20px; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #94a3b8;">This lead was captured via your Quote Request form.</p>
                    </div>
                </div>
            </div>
            `
        });

        res.status(200).json("qoute request sent successfully")
    }
    catch (err) {
        console.error("Quote Email Error:", err);
        res.status(500).json(err)
    }
})



router.delete("/:id", async (req, res) => {
    try {
        await qoute.findByIdAndDelete(req.params.id)
        res.status(200).json("qoute request deleted successfully")
    }
    catch (err) {
        res.status(500).json(err)
    }
})
//get by id
router.get("/:id", async (req, res) => {
    try {
        const qouteRequest = await qoute.findById(req.params.id)
        res.status(200).json(qouteRequest)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//get all qoute requests
router.get("/", async (req, res) => {
    try {
        const qouteRequests = await qoute.find()
        res.status(200).json(qouteRequests)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
//get by category
router.get("/category/:category", async (req, res) => {
    try {
        const qouteRequests = await qoute.find({ services: req.params.category })
        res.status(200).json(qouteRequests)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

export default router