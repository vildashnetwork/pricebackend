import  mongoose from 'mongoose';

const productschema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    technologies:{
        type: [String],
        required: true
    },
    images:{
        type: [String],
        required: true
    },
    primaryimage:{
        type: String,
        required: true
    },
    fromprice:{
        type: String,
        required: true
    },
    toprice:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    weblink:{
        type: String,
        required: true
    }
},
{timestamps: true});

const products = mongoose.model("products", productschema);
export default products