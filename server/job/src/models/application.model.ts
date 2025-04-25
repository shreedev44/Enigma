import mongoose, { Schema } from 'mongoose'
import { IApplicationSchema } from '@entities'

const ApplicationSchema = new Schema<IApplicationSchema>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        jobId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        summary: {
            type: String,
            required: true,
        },
        education: [
            {
                university: {
                    type: String,
                    required: true,
                },
                degree: {
                    type: String,
                    required: true,
                },
                graduationYear: {
                    type: Number,
                    required: true,
                },
                cgpa: {
                    type: Number,
                    required: true,
                },
            },
        ],
        skills: {
            type: [String],
            required: true,
        },
        experience: [
            {
                company: {
                    type: String,
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                location: {
                    type: String,
                    required: true,
                },
                dates: {
                    type: String,
                    required: true,
                },
            },
        ],
        yearOfExperience: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['received', 'shortlisted'],
            default: 'received',
        },
        resume: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model<IApplicationSchema>('Application', ApplicationSchema, 'Applications')
