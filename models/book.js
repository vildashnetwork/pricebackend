import mongoose from "mongoose"

const bookschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        defualt: ""
    },
    phone: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    budget: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
}, { timestamps: true })


const book = mongoose.model("book", bookschema)

export default book