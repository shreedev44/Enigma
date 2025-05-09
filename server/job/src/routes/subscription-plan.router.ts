import { Router } from 'express'
import { SubscriptionPlanController } from '@controllers/implementation'
import { SubscriptionPlanService } from '@services/implementation'
import SubscriptionPlanRepository from '@repositories/implementation/subscription-plan.repository'
import { validateData, validateRole } from '@middlewares'
import { validationSchemas } from '@constants'

const subscriptionPlanService = new SubscriptionPlanService(SubscriptionPlanRepository)
const subscriptionPlanController = new SubscriptionPlanController(subscriptionPlanService)

const subscriptionPlanRouter = Router()

subscriptionPlanRouter.post(
    '/',
    validateData(validationSchemas.subscriptionPlanSchema),
    subscriptionPlanController.createPlan.bind(subscriptionPlanController)
)
subscriptionPlanRouter.get(
    '/',
    validateRole('admin'),
    subscriptionPlanController.findAllPlans.bind(subscriptionPlanController)
)
subscriptionPlanRouter.get('/listed/', subscriptionPlanController.findListedPlans.bind(subscriptionPlanController))
subscriptionPlanRouter.patch('/list/:planId', subscriptionPlanController.listPlan.bind(subscriptionPlanController))
subscriptionPlanRouter.patch('/unlist/:planId', subscriptionPlanController.unListPlan.bind(subscriptionPlanController))

export default subscriptionPlanRouter
