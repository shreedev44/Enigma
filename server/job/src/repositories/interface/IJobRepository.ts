import { IJobSchema } from '@entities'
import { IBaseRepository } from '@shreedev44/enigma-shared'
import { Types } from 'mongoose'

export interface IJobRepository extends IBaseRepository<IJobSchema> {
    create(job: Partial<IJobSchema>): Promise<IJobSchema>
    updateById(userId: Types.ObjectId, jobId: string, data: Partial<IJobSchema>): Promise<IJobSchema | null>
    deleteById(userId: Types.ObjectId, jobId: string): Promise<boolean>
    findJobsByUserId(userId: Types.ObjectId): Promise<IJobSchema[]>
    findAllJobs(): Promise<IJobSchema[]>
}
