import { ISubscriptionSchema } from '@entities'
import { IBaseRepository } from '@shreedev44/enigma-shared'

export interface ISubscriptionRepository extends IBaseRepository<ISubscriptionSchema> {
    create(data: Partial<ISubscriptionSchema>): Promise<ISubscriptionSchema>
    findByUserId(userId: string): Promise<ISubscriptionSchema | null>
}
