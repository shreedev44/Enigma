import { ISubscriptionPlanSchema } from '@entities'
import { IBaseRepository } from '@shreedev44/enigma-shared'
import { Types } from 'mongoose'

export interface ISubscriptionPlanRepository extends IBaseRepository<ISubscriptionPlanSchema> {
    listOrUnlistById(planId: Types.ObjectId, list: boolean): Promise<void>
    findAllListedSubscriptions(): Promise<ISubscriptionPlanSchema[]>
    findAllSubscriptions(): Promise<ISubscriptionPlanSchema[]>
    findById(planId: Types.ObjectId): Promise<ISubscriptionPlanSchema | null>
}
