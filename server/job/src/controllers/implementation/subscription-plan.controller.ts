import { _HttpStatus, Messages } from '@constants'
import { ISubscriptionPlanController } from '@controllers/interface'
import { ISubscriptionPlanService } from '@services/interface'
import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'

export class SubscriptionPlanController implements ISubscriptionPlanController {
    constructor(private _subscriptionPlanService: ISubscriptionPlanService) {}

    async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this._subscriptionPlanService.createPlan(req.body)
            res.status(_HttpStatus.OK).json({ message: Messages.PLAN_ADDED })
        } catch (err) {
            next(err)
        }
    }

    async listPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { planId } = req.params
            if (!planId || !Types.ObjectId.isValid(planId)) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_ID })
                return
            }
            await this._subscriptionPlanService.listPlan(planId)
            res.status(_HttpStatus.OK).json({ message: Messages.PLAN_LISTED })
        } catch (err) {
            next(err)
        }
    }

    async unListPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { planId } = req.params
            if (!planId || !Types.ObjectId.isValid(planId)) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_ID })
                return
            }
            await this._subscriptionPlanService.unlistPlan(planId)
            res.status(_HttpStatus.OK).json({ message: Messages.PLAN_UNLISTED })
        } catch (err) {
            next(err)
        }
    }

    async findListedPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const plans = await this._subscriptionPlanService.findListedPlans()
            res.status(_HttpStatus.OK).json({ plans })
        } catch (err) {
            next(err)
        }
    }

    async findAllPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const plans = await this._subscriptionPlanService.findAllPlans()
            res.status(_HttpStatus.OK).json({ plans })
        } catch (err) {
            next(err)
        }
    }
}
