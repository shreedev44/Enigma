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
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number }> {
        try {
            const tagPattern = tags.length > 0 ? new RegExp(`\\b(${tags.join('|')})\\b`, 'i') : /^$/
            const documents = await this.model.countDocuments({
                jobId: jobId,
                status: 'received',
                $or: [
                    { skills: { $in: tags.map((tag) => new RegExp(`\\b${tag}\\b`, 'i')) } },

                    { 'education.university': { $regex: tagPattern } },
                    { 'education.degree': { $regex: tagPattern } },
                    { 'experience.company': { $regex: tagPattern } },
                    { 'experience.title': { $regex: tagPattern } },

                    { summary: { $regex: tagPattern } },
                ],
            })

            const applications = await this.model
                .find({
                    jobId: jobId,
                    status: 'received',
                    $or: [
                        { skills: { $in: tags.map((tag) => new RegExp(`\\b${tag}\\b`, 'i')) } },

                        { 'education.university': { $regex: tagPattern } },
                        { 'education.degree': { $regex: tagPattern } },
                        { 'experience.company': { $regex: tagPattern } },
                        { 'experience.title': { $regex: tagPattern } },

                        { summary: { $regex: tagPattern } },
                    ],
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
            return { applications, totalPages: Math.ceil(documents / limit) }
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
            const tagPattern = tags.length > 0 ? new RegExp(`\\b(${tags.join('|')})\\b`, 'i') : /^$/
            const result = await this.model.updateMany(
                {
                    jobId: jobId,
                    status: 'received',
                    $or: [
                        { skills: { $in: tags.map((tag) => new RegExp(`\\b${tag}\\b`, 'i')) } },

                        { 'education.university': { $regex: tagPattern } },
                        { 'education.degree': { $regex: tagPattern } },
                        { 'experience.company': { $regex: tagPattern } },
                        { 'experience.title': { $regex: tagPattern } },

                        { summary: { $regex: tagPattern } },
                    ],
                },
                { status: 'shortlisted' }
            )
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
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number }> {
        try {
            const documents = await this.model.countDocuments({ status: 'shortlisted', jobId })
            const applications = await this.model
                .find({ jobId, status: 'shortlisted' })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)

            return { applications, totalPages: Math.ceil(documents / limit) }
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
}

export default new ApplicationRepository()
