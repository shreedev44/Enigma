/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApplicationWithJob } from '@types'

export class MyApplications {
    applications: ApplicationWithJob[]
    totalPages: number

    constructor(returnObj: any) {
        this.applications = returnObj.applications.map((application: any) => {
            return {
                _id: application._id,
                companyName: application.companyName,
                role: application.role,
                createdAt: application.createdAt,
            }
        })
        this.totalPages = returnObj.totalPages
    }
}
