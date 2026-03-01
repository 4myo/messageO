import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log("MongoDB connected:", mongoose.connection.host);
    } catch (error) {
        console.log("MongoDB connection error:", error?.message || error);
        process.exit(1); // 1 status code means fail, 0 means success
    }
};
