import mongoose from "mongoose"

const qouteschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    company: {
        type: String,
        default: ""
    },
    services: {
        type: [String],
        required: true
    },
    budget: {
        type: String,
        required: true
    },
    timeline: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        default: ""
    }

},
    { timestamps: true })

const qoute = mongoose.model("qoutes", qouteschema)

export default qoute