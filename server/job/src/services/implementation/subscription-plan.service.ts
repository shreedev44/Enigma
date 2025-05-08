import { _HttpStatus } from '@constants'
import { ISubscriptionPlanSchema } from '@entities'
import { ISubscriptionPlanRepository } from '@repositories/interface'
import { ISubscriptionPlanService } from '@services/interface'
import { Types } from 'mongoose'

export class SubscriptionPlanService implements ISubscriptionPlanService {
    constructor(private _subscriptionPlanRepository: ISubscriptionPlanRepository) {}

    async createPlan(planData: Partial<ISubscriptionPlanSchema>): Promise<void> {
        await this._subscriptionPlanRepository.create(planData)
    }

    async listPlan(planId: string): Promise<void> {
        await this._subscriptionPlanRepository.listOrUnlistById(new Types.ObjectId(planId), true)
    }

    async unlistPlan(planId: string): Promise<void> {
        await this._subscriptionPlanRepository.listOrUnlistById(new Types.ObjectId(planId), false)
    }

    async findListedPlans(): Promise<ISubscriptionPlanSchema[]> {
        const plans = await this._subscriptionPlanRepository.findAllListedSubscriptions()
        return plans
    }

    async findAllPlans(): Promise<ISubscriptionPlanSchema[]> {
        const plans = await this._subscriptionPlanRepository.findAllListedSubscriptions()
        return plans
    }
}
