import mongoose, { Schema } from 'mongoose'
import { ISubscriptionSchema } from '@entities'

const JobSchema = new Schema<ISubscriptionSchema>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        planId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        startedAt: {
            type: Date,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model<ISubscriptionSchema>('Subscription', JobSchema, 'Subscriptions')
