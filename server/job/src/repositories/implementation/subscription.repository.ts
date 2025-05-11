import { ISubscriptionSchema } from '@entities'
import { BaseRepository } from '@shreedev44/enigma-shared'
import { ISubscriptionRepository } from '@repositories/interface'
import Subscription from '@models/subscription.model'
import { Types } from 'mongoose'

class SubscriptionRepository extends BaseRepository<ISubscriptionSchema> implements ISubscriptionRepository {
    constructor() {
        super(Subscription)
    }

    async findByTransactionId(transactionId: string): Promise<ISubscriptionSchema | null> {
        try {
            return await this.model.findOne({ transactionId })
        } catch (err) {
            console.error(err)
            throw new Error('Error finding subscription using transaction id')
        }
    }

    async findLatestSubscription(userId: string): Promise<ISubscriptionSchema | null> {
        try {
            return await this.model.findOne({ userId }).sort({ expiresAt: -1 })
        } catch (err) {
            console.error(err)
            throw new Error('Error finding latest subscription')
        }
    }

    async findAllWithEarlyDate(
        userId: Types.ObjectId
    ): Promise<{ totalMaxInterviews: number; earliestStartDate: Date }[]> {
        try {
            const subscriptions = await this.model.aggregate([
                {
                    $match: {
                        userId,
                        expiresAt: { $gt: new Date() },
                    },
                },
                {
                    $lookup: {
                        from: 'SubscriptionPlans',
                        localField: 'planId',
                        foreignField: '_id',
                        as: 'plan',
                    },
                },
                { $unwind: '$plan' },
                {
                    $group: {
                        _id: '$userId',
                        totalMaxInterviews: { $sum: '$plan.maxInterviews' },
                        earliestStartDate: { $min: '$startedAt' },
                    },
                },
            ])
            console.log(subscriptions)

            return subscriptions
        } catch (err) {
            console.error(err)
            throw new Error('Error checking interview conducting eligibility')
        }
    }
}

export default new SubscriptionRepository()
