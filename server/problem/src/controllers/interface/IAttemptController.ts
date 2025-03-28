import { NextFunction, Request, Response } from 'express'

export interface IAttemptController {
    submitSolution(req: Request, res: Response, next: NextFunction): Promise<void>
    getAttempts(req: Request, res: Response, next: NextFunction): Promise<void>
    findAttempt(req: Request, res: Response, next: NextFunction): Promise<void>
    getProfileStats(req: Request, res: Response, next: NextFunction): Promise<void>
    getAttemptsPerDay(req: Request, res: Response, next: NextFunction): Promise<void>
}
