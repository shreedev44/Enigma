/* eslint-disable @typescript-eslint/no-explicit-any */

import { Education, Experience } from '@entities'
import { Types } from 'mongoose'

export class ApplicationInfo {
    userId: Types.ObjectId
    jobId: Types.ObjectId
    name: string
    phone: string
    email: string
    summary: string
    education: Education[]
    skills: string[]
    experience: Experience[]
    yearOfExperience: number
    status: 'received' | 'shortlisted'
    createdAt: Date

    constructor(returnObj: any) {
        this.userId = returnObj.userId
        this.jobId = returnObj.jobId
        this.name = returnObj.name
        this.phone = returnObj.phone
        this.email = returnObj.email
        this.summary = returnObj.summary
        this.education = returnObj.education
        this.skills = returnObj.skills
        this.experience = returnObj.experience
        this.yearOfExperience = returnObj.yearOfExperience
        this.status = returnObj.status
        this.createdAt = returnObj.createdAt
    }
}
