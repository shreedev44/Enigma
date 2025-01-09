import mongoose, { Document, Schema } from "mongoose";
import { UserType } from "../Types/types";

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique:true
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        subscriptionType: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model<UserType>("User", UserSchema, "Users")