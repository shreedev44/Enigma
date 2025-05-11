import { ISubscriptionSchema } from '@entities'
import { IBaseRepository } from '@shreedev44/enigma-shared'
import { Types } from 'mongoose'

export interface ISubscriptionRepository extends IBaseRepository<ISubscriptionSchema> {
    create(data: Partial<ISubscriptionSchema>): Promise<ISubscriptionSchema>
    findByUserId(userId: string): Promise<ISubscriptionSchema | null>
    findByTransactionId(transactionId: string): Promise<ISubscriptionSchema | null>
    findLatestSubscription(userId: string): Promise<ISubscriptionSchema | null>
    findAllWithEarlyDate(userId: Types.ObjectId): Promise<{ totalMaxInterviews: number; earliestStartDate: Date }[]>
}
