import { NextFunction, Request, Response } from 'express'

export interface IInterviewController {
    schedule(req: Request, res: Response, next: NextFunction): Promise<void>
    getInterviews(req: Request, res: Response, next: NextFunction): Promise<void>
    getTotalInterviews(req: Request, res: Response, next: NextFunction): Promise<void>
}
