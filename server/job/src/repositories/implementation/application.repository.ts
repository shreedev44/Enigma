import { IApplicationSchema } from '@entities'
import { IApplicationRepository } from '../interface/IApplicationRepository'
import { BaseRepository } from '@shreedev44/enigma-shared'
import Application from '@models/application.model'
import { Types } from 'mongoose'
import { ApplicationWithJob } from '@types'

class ApplicationRepository extends BaseRepository<IApplicationSchema> implements IApplicationRepository {
    constructor() {
        super(Application)
    }

    async create(application: Partial<IApplicationSchema>): Promise<IApplicationSchema> {
        try {
            const applicationData = await this.model.create(application)
            return applicationData
        } catch (err) {
            console.error(err)
            throw new Error('Error creating application')
        }
    }

    async deleteById(userId: Types.ObjectId, applicationId: Types.ObjectId): Promise<boolean> {
        try {
            const result = await this.model.deleteOne({ _id: applicationId, userId })
            return result.deletedCount > 0
        } catch (err) {
            console.error(err)
            throw new Error('Error deleting application by ID')
        }
    }

    async findApplicationsByJobId(
        jobId: Types.ObjectId,
        skip: number,
        limit: number,
        tags: string[]
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number; totalApplications: number }> {
        try {
            const tagPattern = tags.length > 0 ? new RegExp(`\\b(${tags.join('|')})\\b`, 'i') : null
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const query: any = {
                jobId: jobId,
                status: 'received',
            }

            if (tagPattern) {
                query.$or = [
                    { skills: { $in: tags.map((tag) => new RegExp(`\\b${tag}\\b`, 'i')) } },
                    { 'education.university': { $regex: tagPattern } },
                    { 'education.degree': { $regex: tagPattern } },
                    { 'experience.company': { $regex: tagPattern } },
                    { 'experience.title': { $regex: tagPattern } },
                    { summary: { $regex: tagPattern } },
                ]
            }

            const documents = await this.model.countDocuments(query)

            const totalApplications = await this.model.countDocuments({ jobId, status: 'received' })
            const applications = await this.model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
            return { applications, totalPages: Math.ceil(documents / limit), totalApplications }
        } catch (err) {
            console.error(err)
            throw new Error('Error finding all applications')
        }
    }

    async findApplication(userId: Types.ObjectId, jobId: Types.ObjectId): Promise<IApplicationSchema | null> {
        try {
            const application = await this.model.findOne({ userId, jobId })
            return application
        } catch (err) {
            console.error(err)
            throw new Error('Error finding all application')
        }
    }

    async shortlistApplications(jobId: Types.ObjectId, tags: string[]): Promise<{ shortlisted: number }> {
        try {
            const tagPattern = tags.length > 0 ? new RegExp(`\\b(${tags.join('|')})\\b`, 'i') : null
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const query: any = {
                jobId: jobId,
                status: 'received',
            }

            if (tagPattern) {
                query.$or = [
                    { skills: { $in: tags.map((tag) => new RegExp(`\\b${tag}\\b`, 'i')) } },
                    { 'education.university': { $regex: tagPattern } },
                    { 'education.degree': { $regex: tagPattern } },
                    { 'experience.company': { $regex: tagPattern } },
                    { 'experience.title': { $regex: tagPattern } },
                    { summary: { $regex: tagPattern } },
                ]
            }
            const result = await this.model.updateMany(query, { status: 'shortlisted' })
            return { shortlisted: result.modifiedCount }
        } catch (err) {
            console.error(err)
            throw new Error('Error shortlisting applications')
        }
    }

    async getShortlist(
        jobId: Types.ObjectId,
        skip: number,
        limit: number
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number; totalApplications: number }> {
        try {
            const documents = await this.model.countDocuments({ status: 'shortlisted', jobId })
            const applications = await this.model
                .find({ jobId, status: 'shortlisted' })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)

            return { applications, totalPages: Math.ceil(documents / limit), totalApplications: documents }
        } catch (err) {
            console.error(err)
            throw new Error('Error finding shortlisted applications')
        }
    }

    async findApplicationById(applicationId: Types.ObjectId): Promise<IApplicationSchema | null> {
        try {
            return await this.model.findById(applicationId)
        } catch (err) {
            console.error(err)
            throw new Error('Error finding application')
        }
    }

    async findResumeKey(applicationId: Types.ObjectId): Promise<string | null> {
        try {
            const application = await this.model.findById(applicationId)
            return application?.resume || null
        } catch (err) {
            console.error(err)
            throw new Error('Error finding resume key')
        }
    }

    async findApplicationsByUserId(
        userId: Types.ObjectId,
        skip: number,
        limit: number
    ): Promise<{ applications: ApplicationWithJob[]; totalPages: number }> {
        try {
            const documents = await this.model.countDocuments({ userId })
            const applications = await this.model.aggregate([
                {
                    $match: { userId },
                },
                {
                    $lookup: {
                        from: 'Jobs',
                        as: 'job',
                        foreignField: '_id',
                        localField: 'jobId',
                    },
                },
                {
                    $unwind: '$job',
                },
                {
                    $project: {
                        _id: 1,
                        companyName: '$job.companyName',
                        role: '$job.role',
                        createdAt: 1,
                        status: 1,
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: limit,
                },
            ])

            return { applications, totalPages: Math.ceil(documents / limit) }
        } catch (err) {
            console.error(err)
            throw new Error('Error getting applications with job')
        }
    }

    async changeStatusById(
        applicationId: Types.ObjectId,
        status: 'received' | 'shortlisted' | 'interview requested' | 'accepted' | 'rejected'
    ): Promise<void> {
        try {
            await this.model.updateOne({ _id: applicationId }, { status })
        } catch (err) {
            console.error(err)
            throw new Error('Error shortlisting single application')
        }
    }

    async findByEmail(email: string): Promise<IApplicationSchema | null> {
        try {
            return await this.model.findOne({ email })
        } catch (err) {
            console.error(err)
            throw new Error('Error finding application by email')
        }
    }

    async getJobApplicationStats(): Promise<{ applicationsPerJob: number }> {
        try {
            const stats = await this.model.aggregate([
                {
                    $group: {
                        _id: '$jobId',
                        applicationCount: { $sum: 1 },
                    },
                },
                {
                    $lookup: {
                        from: 'Jobs',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'job',
                    },
                },
                {
                    $match: {
                        job: { $ne: [] },
                    },
                },
                {
                    $count: 'totalJobs',
                },
            ])

            const totalJobs = stats.length > 0 ? stats[0].totalJobs : 0
            const applicationsPerJob = totalJobs > 0 ? (await this.model.countDocuments()) / totalJobs : 0

            return { applicationsPerJob }
        } catch (err) {
            console.error(err)
            throw new Error('Error getting stats')
        }
    }
}

export default new ApplicationRepository()
