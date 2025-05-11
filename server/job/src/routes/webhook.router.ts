import { raw, Router } from 'express'
import { SubscriptionController } from '@controllers/implementation'
import { SubscriptionService } from '@services/implementation'
import SubscriptionRepository from '@repositories/implementation/subscription.repository'
import SubscriptionPlanRepository from '@repositories/implementation/subscription-plan.repository'

const subscriptionService = new SubscriptionService(SubscriptionRepository, SubscriptionPlanRepository)
const subscriptionController = new SubscriptionController(subscriptionService)

const webhookRouter = Router()

webhookRouter.post(
    '/stripe',
    raw({ type: 'application/json' }),
    subscriptionController.handleWebHook.bind(subscriptionController)
)

export default webhookRouter
