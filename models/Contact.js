import mongoose from "mongoose"


const contactschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
}, { timestamps: true })


const contact = mongoose.model("contacts", contactschema)

export default contact