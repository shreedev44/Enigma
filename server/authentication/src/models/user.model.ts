import mongoose, { Schema } from 'mongoose'
import { UserType } from '@types'
import { IUserSchema } from '../entities/IUser'

const UserSchema: Schema = new Schema<IUserSchema>(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            required: true,
            enum: ['student', 'recruiter', 'admin'],
        },
        status: {
            type: String,
            required: true,
            enum: ['active', 'blocked'],
            default: 'active',
        },
        subscriptionType: {
            type: String,
            required: true,
            enum: ['free', 'premium'],
            default: 'free',
        },
    },
    {
        timestamps: true,
    }
)

export interface UserDocument extends Document, UserType {}

export default mongoose.model<UserDocument>('User', UserSchema, 'Users')
