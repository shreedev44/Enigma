import { ISubscriptionSchema } from '@entities'
import { BaseRepository } from '@shreedev44/enigma-shared'
import { ISubscriptionRepository } from '@repositories/interface'
import Subscription from '@models/subscription.model'

class SubscriptionRepository extends BaseRepository<ISubscriptionSchema> implements ISubscriptionRepository {
    constructor() {
        super(Subscription)
    }
}

export default new SubscriptionRepository()
