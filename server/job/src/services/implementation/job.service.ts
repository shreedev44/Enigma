import { IJobService } from '@services/interface'
import { IJobSchema } from '@entities'
import { IJobRepository } from '@repositories/interface'
import { createHttpError } from '@utils'
import { _HttpStatus, Messages } from '@constants'
import { Types } from 'mongoose'

export class JobService implements IJobService {
    constructor(private _jobRepository: IJobRepository) {}

    async createJob(userId: string, jobData: Partial<IJobSchema>): Promise<IJobSchema> {
        const job = await this._jobRepository.create({
            ...jobData,
            userId: new Types.ObjectId(userId),
        })
        return job
    }

    async updateJob(userId: string, jobId: string, jobData: Partial<IJobSchema>): Promise<IJobSchema | null> {
        const updatedJob = await this._jobRepository.updateById(new Types.ObjectId(userId), jobId, jobData)

        if (!updatedJob) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }
        return updatedJob
    }

    async deleteJob(userId: string, jobId: string): Promise<boolean> {
        const isDeleted = await this._jobRepository.deleteById(new Types.ObjectId(userId), jobId)

        if (!isDeleted) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.JOB_NOT_FOUND)
        }
        return isDeleted
    }

    async getJobsByUserId(userId: string, page: number): Promise<{ jobs: IJobSchema[]; totalPages: number }> {
        const dataPerPage = 1
        const skip = page * dataPerPage - 1
        const result = await this._jobRepository.findJobsByUserId(new Types.ObjectId(userId), skip, dataPerPage)

        return result
    }

    async getAllJobs(
        page: number,
        sortBy: string,
        sortOrder: number,
        filter: string
    ): Promise<{ jobs: IJobSchema[]; totalPages: number }> {
        const dataPerPage = 1
        const skip = page * dataPerPage - 1

        let query: object = { listed: true }
        if (filter) {
            query = {
                $and: [
                    {
                        $or: [
                            { title: { $regex: filter, $options: 'i' } },
                            { companyName: { $regex: filter, $options: 'i' } },
                        ],
                    },
                    { listed: true },
                ],
            }
        }
        const result = await this._jobRepository.findAllJobs(skip, dataPerPage, query)
        return result
    }
}
