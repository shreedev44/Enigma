import { NextFunction, Request, Response } from 'express'

export interface IApplicationController {
    apply(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteApplication(req: Request, res: Response, next: NextFunction): Promise<void>
    getMyApplications(req: Request, res: Response, next: NextFunction): Promise<void>
    getApplicationsByJob(req: Request, res: Response, next: NextFunction): Promise<void>
    shortlistApplications(req: Request, res: Response, next: NextFunction): Promise<void>
    getShortlist(req: Request, res: Response, next: NextFunction): Promise<void>
    getApplicationDetails(req: Request, res: Response, next: NextFunction): Promise<void>
    getResumeUrl(req: Request, res: Response, next: NextFunction): Promise<void>
    shortlistSingleApplication(req: Request, res: Response, next: NextFunction): Promise<void>
    removeApplicationFromShortlist(req: Request, res: Response, next: NextFunction): Promise<void>
    getApplicationStats(req: Request, res: Response, next: NextFunction): Promise<void>
    acceptSchedule(req: Request, res: Response, next: NextFunction): Promise<void>
    rejectSchedule(req: Request, res: Response, next: NextFunction): Promise<void>
    applicationsPerDate(req: Request, res: Response, next: NextFunction): Promise<void>
}
