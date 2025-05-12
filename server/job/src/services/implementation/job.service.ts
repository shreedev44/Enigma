import { IJobService } from '@services/interface'
import { IJobSchema } from '@entities'
import { IJobRepository } from '@repositories/interface'
import { createHttpError } from '@utils'
import { _HttpStatus, Messages } from '@constants'
import { Types } from 'mongoose'
import { JobDTO } from '@dtos'

export class JobService implements IJobService {
    constructor(private _jobRepository: IJobRepository) {}

    async createJob(userId: string, jobData: Partial<IJobSchema>): Promise<InstanceType<typeof JobDTO.JobInfo>> {
        const job = await this._jobRepository.create({
            ...jobData,
            userId: new Types.ObjectId(userId),
        })
        return new JobDTO.JobInfo(job)
    }

    async updateJob(
        userId: string,
        jobId: string,
        jobData: Partial<IJobSchema>
    ): Promise<InstanceType<typeof JobDTO.JobInfo>> {
        const updatedJob = await this._jobRepository.updateById(new Types.ObjectId(userId), jobId, jobData)

        if (!updatedJob) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }
        return new JobDTO.JobInfo(updatedJob)
    }

    async deleteJob(userId: string, jobId: string, isAdmin: boolean): Promise<boolean> {
        const isDeleted = await this._jobRepository.deleteById(new Types.ObjectId(userId), jobId, isAdmin)

        if (!isDeleted) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }
        return isDeleted
    }

    async getJobsByUserId(userId: string, page: number): Promise<InstanceType<typeof JobDTO.Jobs>> {
        const dataPerPage = 6
        const skip = dataPerPage * (page - 1)
        const result = await this._jobRepository.findJobsByUserId(new Types.ObjectId(userId), skip, dataPerPage)

        return new JobDTO.Jobs(result)
    }

    async getAllJobs(
        page: number,
        sortBy: string,
        sortOrder: 1 | -1,
        filter: string,
        userId: string,
        isAdmin: boolean,
        expectedSalary?: number,
        workMode?: string,
        workTime?: string,
        minimumExperience?: number
    ): Promise<InstanceType<typeof JobDTO.Jobs>> {
        const dataPerPage = 6
        const skip = dataPerPage * (page - 1)

        let query: object = isAdmin ? {} : { listed: true }

        const andConditions = []

        if (filter) {
            const orConditions = [
                { role: { $regex: filter, $options: 'i' } },
                { companyName: { $regex: filter, $options: 'i' } },
                { workTime: { $regex: filter, $options: 'i' } },
                { workMode: { $regex: filter, $options: 'i' } },
                { jobLocation: { $regex: filter, $options: 'i' } },
            ]
            andConditions.push({ $or: orConditions })
        }

        if (!isAdmin) {
            andConditions.push({ listed: true })
        }

        if (userId) {
            andConditions.push({ userId: new Types.ObjectId(userId) })
        }

        if (expectedSalary && expectedSalary !== 0) {
            andConditions.push({
                minSalary: { $lte: expectedSalary },
                maxSalary: { $gte: expectedSalary },
            })
        }

        if (workMode) {
            andConditions.push({ workMode: workMode })
        }

        if (workTime) {
            andConditions.push({ workTime: workTime })
        }

        if (minimumExperience) {
            andConditions.push({ minimumExperience: { $gte: minimumExperience } })
        }

        if (andConditions.length > 0) {
            query = { $and: andConditions }
        }
        console.log(query)

        const result = await this._jobRepository.findAllJobs(skip, dataPerPage, query, sortBy, sortOrder)
        return new JobDTO.Jobs(result)
    }

    async getJobDetails(jobId: string): Promise<InstanceType<typeof JobDTO.JobInfo>> {
        const jobDetails = await this._jobRepository.findByJobId(new Types.ObjectId(jobId))
        if (!jobDetails) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }
        return new JobDTO.JobInfo(jobDetails)
    }

    async getJobStats(): Promise<{ date: Date; count: number }[]> {
        const result = await this._jobRepository.getJobStats()
        return result
    }

    async getTotalJobsPosted(userId: string): Promise<number> {
        const count = await this._jobRepository.getTotalJobsById(new Types.ObjectId(userId))
        return count
    }
}
