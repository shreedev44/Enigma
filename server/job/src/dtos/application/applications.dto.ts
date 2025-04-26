/* eslint-disable @typescript-eslint/no-explicit-any */

import { Types } from 'mongoose'

export class Applications {
    applications: {
        userId: Types.ObjectId
        name: string
        phone: string
        email: string
        yearOfExperience: number
        createdAt: Date
    }[]
    totalPages: number

    constructor(returnObj: any) {
        this.applications = returnObj.applications.map((application: any) => {
            return {
                userId: application.userId,
                name: application.name,
                phone: application.phone,
                email: application.email,
                yearOfExperience: application.yearOfExperience,
                createdAt: application.createdAt,
            }
        })
        this.totalPages = returnObj.totalPages
    }
}
