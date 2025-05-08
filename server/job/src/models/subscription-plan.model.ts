import mongoose, { Schema } from 'mongoose'
import { ISubscriptionPlanSchema } from '@entities'

const JobSchema = new Schema<ISubscriptionPlanSchema>(
    {
        name: {
            type: String,
            required: true,
        },
        features: {
            type: [String],
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

export default mongoose.model<ISubscriptionPlanSchema>('SubscriptionPlan', JobSchema, 'SubscriptionPlans')
