import qoute from "../models/Qoutes.js"
import express from "express"
const router = express.Router()

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
        res.status(200).json("qoute request sent successfully")
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//delete by id
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