// server.js (updated)
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import cors from "cors";
import products from "./routes/products.js";
import contact from "./routes/contact.js";
import qoute from "./routes/qoute.js";
import book from "./routes/book.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 2000;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Server is running");
});

// Routes
app.use("/api/products", products);
app.use("/api/contact", contact);
app.use("/api/qoute", qoute);
app.use("/api/book", book);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});