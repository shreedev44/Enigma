import { Document, Types } from 'mongoose'

export interface Education {
    university: string
    degree: string
    graduationYear: number
    cgpa: number
}

export interface Experience {
    company: string
    title: string
    location: string
    dates: string
}

export interface IApplicationSchema extends Document {
    userId: Types.ObjectId
    jobId: Types.ObjectId
    name: string
    location: string
    phone: string
    email: string
    summary: string
    education: Education[]
    skills: string[]
    experience: Experience[]
    yearOfExperience: number
    createdAt: Date
    updatedAt: Date
}
