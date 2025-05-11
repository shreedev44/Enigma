import { _HttpStatus, Messages } from '@constants'
import { ISubscriptionController } from '@controllers/interface'
import { ISubscriptionService } from '@services/interface'
import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'

export class SubscriptionController implements ISubscriptionController {
    constructor(private _subscriptionService: ISubscriptionService) {}

    async createPaymentSession(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { planId } = req.params
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)

            if (!planId || !Types.ObjectId.isValid(planId)) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_ID })
                return
            }
            const url = await this._subscriptionService.createCheckoutSession(planId, userId)
            res.status(_HttpStatus.OK).json({ url })
        } catch (err) {
            next(err)
        }
    }

    async handleWebHook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const signature = req.headers['stripe-signature'] as string

            if (!signature) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.SIGNATURE_NOT_FOUND })
                return
            }

            await this._subscriptionService.handleWebHook(req.body, signature)
        } catch (err) {
            next(err)
        }
    }

    async getSessionDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { sessionId } = req.params
            if (!sessionId) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INCOMPLETE_FORM })
                return
            }
            const sessionDetails = await this._subscriptionService.getSessionDetails(sessionId)
            res.status(_HttpStatus.OK).json(sessionDetails)
        } catch (err) {
            next(err)
        }
    }

    async getSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)
            const subscription = await this._subscriptionService.getSubscription(userId)
            res.status(_HttpStatus.OK).json(subscription)
        } catch (err) {
            next(err)
        }
    }
}
