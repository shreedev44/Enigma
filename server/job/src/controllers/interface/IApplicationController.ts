import { NextFunction, Request, Response } from 'express'

export interface IApplicationController {
    apply(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteApplication(req: Request, res: Response, next: NextFunction): Promise<void>
    getMyApplications(req: Request, res: Response, next: NextFunction): Promise<void>
    getApplicationByJob(req: Request, res: Response, next: NextFunction): Promise<void>
}
