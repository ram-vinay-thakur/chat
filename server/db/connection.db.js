import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

async function connection(url) {
    try {
        await mongoose.connect(url);
          console.log('MongoDB connected successfully');
    } catch (error) {
        return ApiError(500, error.message)
    }
}

export default connection;