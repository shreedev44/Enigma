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
            await this.model.updateOne({ _id: jobId, userId, listed: true }, data)
            const updatedJob = await this.model.findById(jobId)
            return updatedJob
        } catch (err) {
            console.error(err)
            throw new Error('Error updating job by ID')
        }
    }

    async deleteById(userId: Types.ObjectId, jobId: string, isAdmin: boolean): Promise<boolean> {
        try {
            if (isAdmin) {
                const result = await this.model.updateOne({ _id: jobId }, { listed: false })
                return result.modifiedCount > 0
            } else {
                const result = await this.model.updateOne({ userId, _id: jobId }, { listed: false })
                return result.modifiedCount > 0
            }
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
            const documents = await this.model.countDocuments({ userId })
            const jobs = await this.model.find({ userId }).skip(skip).limit(limit)
            return { jobs, totalPages: Math.ceil(documents / limit) }
        } catch (err) {
            console.error(err)
            throw new Error('Error finding jobs by user ID')
        }
    }

    async findAllJobs(
        skip: number,
        limit: number,
        query: object,
        sortBy: string,
        sortOrder: 1 | -1
    ): Promise<{ jobs: IJobSchema[]; totalPages: number }> {
        try {
            const documents = await this.model.countDocuments(query)
            const jobs = await this.model.aggregate([
                {
                    $match: query,
                },
                {
                    $sort: { [sortBy]: sortOrder },
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
            return await this.model.findOne({ _id: jobId, userId })
        } catch (err) {
            console.error(err)
            throw new Error('Error finding job')
        }
    }

    async findByJobId(jobId: Types.ObjectId): Promise<IJobSchema | null> {
        try {
            return await this.model.findById(jobId)
        } catch (err) {
            console.log(err)
            throw new Error('Error getting job details')
        }
    }

    async getJobStats(): Promise<{ date: Date; count: number }[]> {
        try {
            const result = await this.model.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        date: '$_id',
                        count: 1,
                    },
                },
                {
                    $sort: { date: 1 },
                },
            ])
            return result
        } catch (err) {
            console.error(err)
            throw new Error('Error getting jobs stats')
        }
    }
}

export default new JobRepository()
