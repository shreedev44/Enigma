import { AttemptType } from '@types'
import mongoose, { Schema } from 'mongoose'

const AttemptSchema: Schema = new Schema<AttemptType>(
    {
        userId: {
            type: String,
            required: true,
        },
        problemNo: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['Accepted', 'Rejected', 'Compile Error'],
        },
        language: {
            type: String,
            required: true,
        },
        solution: {
            type: String,
            required: true,
        },
        runTime: {
            type: String,
            required: true,
        },
        testCasePassed: {
            type: Number,
            required: true,
        },
        memory: {
            type: String,
            required: true,
        },
        rejectionMessage: {
            type: String,
        },
        rejectedTestCase: {
            expected: {
                type: String,
            },
            output: {
                type: String,
            },
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model<AttemptType>('Attempt', AttemptSchema, 'Attempts')
