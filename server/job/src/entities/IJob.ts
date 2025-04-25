import { Document, Types } from 'mongoose'

export interface IJobSchema extends Document {
    userId: Types.ObjectId
    companyName: string
    profilePicture: string
    role: string
    workTime: 'Full-Time' | 'Part-Time'
    workMode: 'On-Site' | 'Remote' | 'Hybrid'
    jobLocation: string
    minimumExperience: number
    minSalary?: number
    maxSalary?: number
    requirements: string[]
    responsibilities: string[]
    listed: boolean
    lastDate: Date
    createdAt: Date
    updatedAt: Date
}
