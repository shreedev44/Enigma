import { NextFunction, Request, Response } from 'express'

export interface IBlacklistController {
    blacklistApplicant(req: Request, res: Response, next: NextFunction): Promise<void>
    getBlacklist(req: Request, res: Response, next: NextFunction): Promise<void>
    removeFromBlacklist(req: Request, res: Response, next: NextFunction): Promise<void>
}
