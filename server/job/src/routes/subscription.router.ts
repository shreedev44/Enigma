import { Router } from 'express'
import { SubscriptionController } from '@controllers/implementation'
import { SubscriptionService } from '@services/implementation'
import SubscriptionRepository from '@repositories/implementation/subscription.repository'
import SubscriptionPlanRepository from '@repositories/implementation/subscription-plan.repository'
import { validateRole } from '@middlewares'

const subscriptionService = new SubscriptionService(SubscriptionRepository, SubscriptionPlanRepository)
const subscriptionController = new SubscriptionController(subscriptionService)

const subscriptionRouter = Router()

subscriptionRouter.post(
    '/payment-session/:planId',
    validateRole('recruiter'),
    subscriptionController.createPaymentSession.bind(subscriptionController)
)
subscriptionRouter.get(
    '/session-details/:sessionId',
    validateRole('recruiter'),
    subscriptionController.getSessionDetails.bind(subscriptionController)
)
subscriptionRouter.get(
    '/subscription-details',
    validateRole('recruiter'),
    subscriptionController.getSubscription.bind(subscriptionController)
)

export default subscriptionRouter
