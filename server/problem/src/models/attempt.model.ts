import { AttemptType } from '@types'
import mongoose, { Schema, Document } from 'mongoose'
import { IAttemptSchema } from '@entities'

const AttemptSchema: Schema = new Schema<IAttemptSchema>(
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

export interface AttemptDocument extends Document, AttemptType {}

export default mongoose.model<AttemptType>('Attempt', AttemptSchema, 'Attempts')
