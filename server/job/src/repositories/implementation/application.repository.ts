import { IApplicationSchema } from '@entities'
import { IApplicationRepository } from '../interface/IApplicationRepository'
import { BaseRepository } from '@shreedev44/enigma-shared'
import Application from '@models/application.model'
import { Types } from 'mongoose'

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

    async deleteById(userId: Types.ObjectId, applicationId: string): Promise<boolean> {
        try {
            const result = await this.model.deleteOne({ _id: applicationId, userId })
            return result.deletedCount > 0
        } catch (err) {
            console.error(err)
            throw new Error('Error deleting application by ID')
        }
    }

    async findApplicationsByUserId(
        userId: Types.ObjectId,
        skip: number,
        limit: number
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number }> {
        try {
            const documents = await this.model.countDocuments()
            const applications = await this.model.find({ userId }).skip(skip).limit(limit)
            return { applications, totalPages: Math.ceil(documents / limit) }
        } catch (err) {
            console.error(err)
            throw new Error('Error finding applications by user ID')
        }
    }

    async findApplicationsByJobId(
        jobId: Types.ObjectId,
        skip: number,
        limit: number
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number }> {
        try {
            const documents = await this.model.countDocuments()
            const applications = await this.model.find({ jobId }).skip(skip).limit(limit)
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
}

export default new ApplicationRepository()
