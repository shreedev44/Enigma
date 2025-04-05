import { Document } from 'mongoose'

export interface IUserSchema extends Document {
    name: string
    email: string
    password?: string
    role: 'student' | 'recruiter' | 'admin'
    status?: 'active' | 'blocked'
    subscriptionType?: 'free' | 'premium'
    createdAt?: Date
    updatedAt?: Date
}
