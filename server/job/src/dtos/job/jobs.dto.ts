/* eslint-disable @typescript-eslint/no-explicit-any */

import { Types } from 'mongoose'

interface Job {
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
    lastDate: Date
    createdAt: Date
}
export class Jobs {
    jobs: Job[]
    totalPages: number

    constructor(returnObj: any) {
        this.jobs = returnObj.jobs.map((job: any) => {
            const obj: Job = {
                _id: job._id,
                companyName: job.companyName,
                profilePicture: job.profilePicture,
                role: job.role,
                workTime: job.workTime,
                workMode: job.workMode,
                jobLocation: job.jobLocation,
                minimumExperience: job.minimumExperience,
                lastDate: job.lastDate,
                createdAt: job.createdAt,
            }
            if (job.minSalary) {
                obj.minSalary = job.minSalary
                obj.maxSalary = job.maxSalary
            }
            return obj
        })
        this.totalPages = returnObj.totalPages
    }
}
