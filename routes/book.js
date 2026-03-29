import express from "express"
import book from "../models/book.js"

const router = express.Router()


router.post("/", async (req, res) => {
    const { name, email, productId, phone, service, budget, desc } = req.body
    try {
        const newBook = new book({
            name,
            email,
            productId,
            phone,
            service,
            budget,
            desc
        })
        await newBook.save()
        res.status(200).json({ message: "book created successfully" })
    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }
})

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