import { Document, Types } from 'mongoose'

export interface ISubscriptionSchema extends Document {
    userId: Types.ObjectId
    planId: Types.ObjectId
    transactionId: string
    startedAt: Date
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
}
