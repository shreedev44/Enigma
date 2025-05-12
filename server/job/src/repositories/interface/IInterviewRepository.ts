import { IInterviewSchema } from '@entities'
import { IBaseRepository } from '@shreedev44/enigma-shared'
import { Types } from 'mongoose'

export interface IInterviewRepository extends IBaseRepository<IInterviewSchema> {
    findAllByUserId(userId: Types.ObjectId): Promise<IInterviewSchema[]>
    canConductInterview(userId: Types.ObjectId, date: Date, totalMaxInterviews: number): Promise<boolean>
    deleteByApplicationId(applicationId: Types.ObjectId): Promise<void>
}
