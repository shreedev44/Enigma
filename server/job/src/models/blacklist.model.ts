import mongoose, { Schema } from 'mongoose'
import { IBlacklistSchema } from '@entities'

const BlacklistSchema = new Schema<IBlacklistSchema>(
    {
        applicantId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        recruiterId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        applicantName: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model<IBlacklistSchema>('Blacklist', BlacklistSchema, 'Blacklists')
