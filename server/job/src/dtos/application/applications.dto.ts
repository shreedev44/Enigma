/* eslint-disable @typescript-eslint/no-explicit-any */

import { Types } from 'mongoose'

export class Applications {
    applications: {
        _id: Types.ObjectId
        name: string
        phone: string
        email: string
        yearOfExperience: number
    }[]
    totalPages: number
    totalApplications: number

    constructor(returnObj: any) {
        this.applications = returnObj.applications.map((application: any) => {
            return {
                _id: application._id,
                name: application.name,
                phone: application.phone,
                email: application.email,
                yearOfExperience: application.yearOfExperience,
            }
        })
        this.totalPages = returnObj.totalPages
        this.totalApplications = returnObj.totalApplications
    }
}
