import { ISubscriptionPlanSchema } from '@entities'
import SubscriptionPlan from '@models/subscription-plan.model'
import { ISubscriptionPlanRepository } from '@repositories/interface'
import { BaseRepository } from '@shreedev44/enigma-shared'
import { Types } from 'mongoose'

class SubscriptionPlanRepository
    extends BaseRepository<ISubscriptionPlanSchema>
    implements ISubscriptionPlanRepository
{
    constructor() {
        super(SubscriptionPlan)
    }

    async listOrUnlistById(planId: Types.ObjectId, list: boolean): Promise<void> {
        try {
            await this.model.findByIdAndUpdate(planId, { listed: list })
        } catch (err) {
            console.error(err)
            throw new Error('Error while listing subscription plan')
        }
    }

    async findAllListedSubscriptions(): Promise<ISubscriptionPlanSchema[]> {
        try {
            const plans = await this.model.find({ listed: true })
            return plans
        } catch (err) {
            console.error(err)
            throw new Error('Error getting all the listed subscriptions plans')
        }
    }

    async findAllSubscriptions(): Promise<ISubscriptionPlanSchema[]> {
        try {
            const plans = await this.model.find()
            return plans
        } catch (err) {
            console.error(err)
            throw new Error('Error getting all the subscriptions plans')
        }
    }
}

export default new SubscriptionPlanRepository()
