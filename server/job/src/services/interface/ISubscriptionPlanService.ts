import { ISubscriptionPlanSchema } from '@entities'

export interface ISubscriptionPlanService {
    createPlan(planData: Partial<ISubscriptionPlanSchema>): Promise<void>
    listPlan(planId: string): Promise<void>
    unlistPlan(planId: string): Promise<void>
    findListedPlans(): Promise<ISubscriptionPlanSchema[]>
    findAllPlans(): Promise<ISubscriptionPlanSchema[]>
}
