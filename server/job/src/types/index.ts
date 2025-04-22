import { Schema } from 'mongoose'

export interface JobType extends Document {
    userId: Schema.Types.ObjectId
    role: string
    workTime: 'Full-Time' | 'Part-Time'
    workMode: 'On-Site' | 'Remote' | 'Hybrid'
    jobLocation: string
    minimumExperience: number
    minSalary?: number
    maxSalary?: number
    requirements: string[]
    responsibilities: string[]
    lastDate: Date
    createdAt: Date
    updatedAt: Date
}
