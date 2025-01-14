import mongoose from "mongoose";
import { env } from "./ENV";

export default function connectDB() {
    mongoose.connect(env.MONGO_URI as string)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err))
}