import { IJobSchema } from '@entities'
import Job from '@models/job.model'
import { IJobRepository } from '@repositories/interface'
import { BaseRepository } from '@shreedev44/enigma-shared'
import { Types } from 'mongoose'

class JobRepository extends BaseRepository<IJobSchema> implements IJobRepository {
    constructor() {
        super(Job)
    }

    async create(job: Partial<IJobSchema>): Promise<IJobSchema> {
        try {
            console.log(job)
            const jobData = await this.model.create(job)
            return jobData
        } catch (err) {
            console.error(err)
            throw new Error('Error creating job')
        }
    }

    async updateById(userId: Types.ObjectId, jobId: string, data: Partial<IJobSchema>): Promise<IJobSchema | null> {
        try {
            await this.model.updateOne({ _id: jobId, userId }, data)
            const updatedJob = await this.model.findById(jobId)
            return updatedJob
        } catch (err) {
            console.error(err)
            throw new Error('Error updating job by ID')
        }
    }

    async deleteById(userId: Types.ObjectId, jobId: string): Promise<boolean> {
        try {
            const result = await this.model.deleteOne({ _id: jobId, userId })
            return result.deletedCount > 0
        } catch (err) {
            console.error(err)
            throw new Error('Error deleting job by ID')
        }
    }

    async findJobsByUserId(
        userId: Types.ObjectId,
        skip: number,
        limit: number
    ): Promise<{ jobs: IJobSchema[]; totalPages: number }> {
        try {
            const documents = await this.model.countDocuments()
            const jobs = await this.model.find({ userId }).skip(skip).limit(limit)
            return { jobs, totalPages: Math.ceil(documents / limit) }
        } catch (err) {
            console.error(err)
            throw new Error('Error finding jobs by user ID')
        }
    }

    async findAllJobs(skip: number, limit: number, query: object): Promise<{ jobs: IJobSchema[]; totalPages: number }> {
        try {
            const documents = await this.model.countDocuments()
            const jobs = await this.model.aggregate([
                {
                    $match: query,
                },
                {
                    $skip: skip,
                },
                {
                    $limit: limit,
                },
            ])
            return { jobs, totalPages: Math.ceil(documents / limit) }
        } catch (err) {
            console.error(err)
            throw new Error('Error finding jobs')
        }
    }

    async findByJobIdAndUserId(jobId: Types.ObjectId, userId: Types.ObjectId): Promise<IJobSchema | null> {
        try {
            console.log(jobId, userId)
            return await this.model.findOne({ _id: jobId, userId })
        } catch (err) {
            console.error(err)
            throw new Error('Error finding job')
        }
    }
}

export default new JobRepository()
