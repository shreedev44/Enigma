import { IApplicationSchema } from '@entities'
import { IBaseRepository } from '@shreedev44/enigma-shared'
import { Types } from 'mongoose'

export interface IApplicationRepository extends IBaseRepository<IApplicationSchema> {
    create(application: Partial<IApplicationSchema>): Promise<IApplicationSchema>
    deleteById(userId: Types.ObjectId, applicationId: string): Promise<boolean>
    findApplicationsByUserId(
        userId: Types.ObjectId,
        skip: number,
        limit: number
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number }>
    findApplicationsByJobId(
        jobId: Types.ObjectId,
        skip: number,
        limit: number,
        tags: string[]
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number }>
    findApplication(userId: Types.ObjectId, jobId: Types.ObjectId): Promise<IApplicationSchema | null>
    shortlistApplications(jobId: Types.ObjectId, tags: string[]): Promise<{ shortlisted: number }>
    getShortlist(
        jobId: Types.ObjectId,
        skip: number,
        limit: number
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number }>
}
