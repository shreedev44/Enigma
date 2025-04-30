import mongoose, { Schema } from 'mongoose'
import { IInterviewSchema } from '@entities'

const JobSchema = new Schema<IInterviewSchema>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        meetingId: {
            type: String,
            required: true,
        },
        candidateEmail: {
            type: String,
        },
        meetingTime: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model<IInterviewSchema>('Interview', JobSchema, 'Interviews')
