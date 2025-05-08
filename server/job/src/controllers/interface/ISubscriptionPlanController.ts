import { NextFunction, Request, Response } from 'express'

export interface ISubscriptionPlanController {
    createPlan(req: Request, res: Response, next: NextFunction): Promise<void>
    listPlan(req: Request, res: Response, next: NextFunction): Promise<void>
    unListPlan(req: Request, res: Response, next: NextFunction): Promise<void>
    findListedPlans(req: Request, res: Response, next: NextFunction): Promise<void>
    findAllPlans(req: Request, res: Response, next: NextFunction): Promise<void>
}
