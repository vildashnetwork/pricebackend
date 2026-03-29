import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Mongoose 6+ always behaves as if these are true, so we omit them
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(` MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;