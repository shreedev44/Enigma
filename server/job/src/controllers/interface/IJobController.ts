import { NextFunction, Request, Response } from 'express'

export interface IJobController {
    createJob(req: Request, res: Response, next: NextFunction): Promise<void>
    updateJob(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteJob(req: Request, res: Response, next: NextFunction): Promise<void>
    getJobsByUserId(req: Request, res: Response, next: NextFunction): Promise<void>
    getAllJobs(req: Request, res: Response, next: NextFunction): Promise<void>
    getJobDetails(req: Request, res: Response, next: NextFunction): Promise<void>
    getJobStats(req: Request, res: Response, next: NextFunction): Promise<void>
    getTotalJobsPosted(req: Request, res: Response, next: NextFunction): Promise<void>
}
