import { NextFunction, Request, Response } from 'express'

export interface ISubscriptionController {
    createPaymentSession(req: Request, res: Response, next: NextFunction): Promise<void>
    handleWebHook(req: Request, res: Response, next: NextFunction): Promise<void>
    getSessionDetails(req: Request, res: Response, next: NextFunction): Promise<void>
    getSubscription(req: Request, res: Response, next: NextFunction): Promise<void>
}
