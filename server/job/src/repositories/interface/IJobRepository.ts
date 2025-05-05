import { IJobSchema } from '@entities'
import { IBaseRepository } from '@shreedev44/enigma-shared'
import { Types } from 'mongoose'

export interface IJobRepository extends IBaseRepository<IJobSchema> {
    create(job: Partial<IJobSchema>): Promise<IJobSchema>
    updateById(userId: Types.ObjectId, jobId: string, data: Partial<IJobSchema>): Promise<IJobSchema | null>
    deleteById(userId: Types.ObjectId, jobId: string, isAdmin: boolean): Promise<boolean>
    findJobsByUserId(
        userId: Types.ObjectId,
        skip: number,
        limit: number
    ): Promise<{ jobs: IJobSchema[]; totalPages: number }>
    findAllJobs(
        skip: number,
        limit: number,
        query: object,
        sortBy: string,
        sortOrder: 1 | -1
    ): Promise<{ jobs: IJobSchema[]; totalPages: number }>
    findByJobIdAndUserId(jobId: Types.ObjectId, userId: Types.ObjectId): Promise<IJobSchema | null>
    findByJobId(jobId: Types.ObjectId): Promise<IJobSchema | null>
}
