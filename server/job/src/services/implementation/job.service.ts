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

    async deleteJob(userId: string, jobId: string): Promise<boolean> {
        const isDeleted = await this._jobRepository.deleteById(new Types.ObjectId(userId), jobId)

        if (!isDeleted) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }
        return isDeleted
    }

    async getJobsByUserId(userId: string, page: number): Promise<InstanceType<typeof JobDTO.Jobs>> {
        const dataPerPage = 1
        const skip = dataPerPage * (page - 1)
        const result = await this._jobRepository.findJobsByUserId(new Types.ObjectId(userId), skip, dataPerPage)

        return new JobDTO.Jobs(result)
    }

    async getAllJobs(
        page: number,
        sortBy: string,
        sortOrder: 1 | -1,
        filter: string,
        userId: string
    ): Promise<InstanceType<typeof JobDTO.Jobs>> {
        const dataPerPage = 2
        const skip = dataPerPage * (page - 1)

        let query: object = { listed: true }
        if (filter || userId) {
            query = {
                $and: [
                    {
                        $or: [
                            { role: { $regex: filter, $options: 'i' } },
                            { companyName: { $regex: filter, $options: 'i' } },
                            { workTime: { $regex: filter, $options: 'i' } },
                            { workMode: { $regex: filter, $options: 'i' } },
                            { jobLocation: { $regex: filter, $options: 'i' } },
                        ],
                    },
                    { listed: true },
                    ...(userId ? [{ userId: new Types.ObjectId(userId) }] : []),
                ],
            }
        }
        const result = await this._jobRepository.findAllJobs(skip, dataPerPage, query, sortBy, sortOrder)
        return new JobDTO.Jobs(result)
    }
}
