import mongoose, { Schema } from 'mongoose'
import { ISubscriptionPlanSchema } from '@entities'

const SubscriptionPlanSchema = new Schema<ISubscriptionPlanSchema>(
    {
        name: {
            type: String,
            required: true,
        },
        maxInterviews: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        durationInDays: {
            type: Number,
            required: true,
        },
        listed: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model<ISubscriptionPlanSchema>('SubscriptionPlan', SubscriptionPlanSchema, 'SubscriptionPlans')
