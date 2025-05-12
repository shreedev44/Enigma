import { IApplicationSchema } from '@entities'
import { IBaseRepository } from '@shreedev44/enigma-shared'
import { ApplicationWithJob } from '@types'
import { Types } from 'mongoose'

export interface IApplicationRepository extends IBaseRepository<IApplicationSchema> {
    create(application: Partial<IApplicationSchema>): Promise<IApplicationSchema>
    deleteById(userId: Types.ObjectId, applicationId: Types.ObjectId): Promise<boolean>
    findApplicationsByUserId(
        userId: Types.ObjectId,
        skip: number,
        limit: number
    ): Promise<{ applications: ApplicationWithJob[]; totalPages: number }>
    findApplicationsByJobId(
        jobId: Types.ObjectId,
        skip: number,
        limit: number,
        tags: string[]
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number; totalApplications: number }>
    findApplication(userId: Types.ObjectId, jobId: Types.ObjectId): Promise<IApplicationSchema | null>
    shortlistApplications(jobId: Types.ObjectId, tags: string[]): Promise<{ shortlisted: number }>
    changeStatusById(
        applicationId: Types.ObjectId,
        status: 'received' | 'shortlisted' | 'interview requested' | 'accepted' | 'rejected'
    ): Promise<void>
    getShortlist(
        jobId: Types.ObjectId,
        skip: number,
        limit: number
    ): Promise<{ applications: IApplicationSchema[]; totalPages: number; totalApplications: number }>
    findApplicationById(applicationId: Types.ObjectId): Promise<IApplicationSchema | null>
    findResumeKey(applicationId: Types.ObjectId): Promise<string | null>
    findByEmail(email: string): Promise<IApplicationSchema | null>
    getJobApplicationStats(): Promise<{ applicationsPerJob: number }>
}
