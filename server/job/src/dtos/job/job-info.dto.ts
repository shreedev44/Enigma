/* eslint-disable @typescript-eslint/no-explicit-any */

import { Types } from 'mongoose'

export class JobInfo {
    _id: Types.ObjectId
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
    lastDate: Date
    createdAt: Date

    constructor(returnObj: any) {
        this._id = returnObj.userId
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
        this.lastDate = returnObj.lastDate
        this.createdAt = returnObj.createdAt
    }
}
