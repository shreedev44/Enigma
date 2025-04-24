import { IApplicationSchema } from '@entities'
import { IBaseRepository } from '@shreedev44/enigma-shared'
import { Types } from 'mongoose'

export interface IApplicationRepository extends IBaseRepository<IApplicationSchema> {
    create(application: Partial<IApplicationSchema>): Promise<IApplicationSchema>
    deleteById(userId: Types.ObjectId, applicationId: string): Promise<boolean>
    findApplicationsByUserId(userId: Types.ObjectId): Promise<IApplicationSchema[]>
    findApplicationsByJobId(jobId: Types.ObjectId): Promise<IApplicationSchema[]>
    findApplication(userId: Types.ObjectId, jobId: Types.ObjectId): Promise<IApplicationSchema | null>
}
