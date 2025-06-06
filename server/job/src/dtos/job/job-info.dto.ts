/* eslint-disable @typescript-eslint/no-explicit-any */

import { Types } from 'mongoose'

export class JobInfo {
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

    constructor(returnObj: any) {
        this.userId = returnObj.userId
        this.companyName = returnObj.companyName
        this.profilePicture = returnObj.profilePicture
        this.role = returnObj.role
        this.workTime = returnObj.workTime
        this.workMode = returnObj.workMode
        this.jobLocation = returnObj.jobLocation
        this.minimumExperience = returnObj.minimumExperience
        if (returnObj.minSalary) {
            this.minSalary = returnObj.minSalary
            this.maxSalary = returnObj.maxSalary
        }
        this.requirements = returnObj.requirements
        this.responsibilities = returnObj.responsibilities
        this.listed = returnObj.listed
        this.lastDate = returnObj.lastDate
        this.createdAt = returnObj.createdAt
    }
}
