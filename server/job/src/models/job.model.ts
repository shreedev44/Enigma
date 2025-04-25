import mongoose, { Schema } from 'mongoose'
import { IJobSchema } from '@entities'

const JobSchema = new Schema<IJobSchema>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            required: true,
            default: '',
        },
        role: {
            type: String,
            required: true,
        },
        workTime: {
            type: String,
            required: true,
            enum: ['Full-Time', 'Part-Time'],
        },
        workMode: {
            type: String,
            required: true,
            enum: ['On-Site', 'Remote', 'Hybrid'],
        },
        jobLocation: {
            type: String,
            required: true,
        },
        minimumExperience: {
            type: Number,
            required: true,
        },
        minSalary: {
            type: Number,
        },
        maxSalary: {
            type: Number,
        },
        requirements: {
            type: [String],
            required: true,
        },
        responsibilities: {
            type: [String],
            required: true,
        },
        lastDate: {
            type: Date,
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

export default mongoose.model<IJobSchema>('Job', JobSchema, 'Jobs')
