import express from "express"
import axios from "axios"
import contact from "../models/Contact.js"
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
        res.status(200).json("message sent successfully")
    }
    catch (err) {
        res.status(500).json(err)
    }
})

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
