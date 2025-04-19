import { NextFunction, Request, Response } from 'express'

export interface ILeaderboardController {
    updateRanks(req: Request, res: Response, next: NextFunction): Promise<void>
}
