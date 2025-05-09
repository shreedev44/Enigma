import { Document } from 'mongoose'

export interface ISubscriptionPlanSchema extends Document {
    name: string
    maxInterviews: number
    price: number
    durationInDays: number
    listed: boolean
    createdAt: Date
    updatedAt: Date
}
