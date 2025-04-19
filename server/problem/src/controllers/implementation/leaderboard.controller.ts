import { _HttpStatus, Messages } from '@constants'
import { ILeaderboardController } from '@controllers/interface'
import { ILeaderboardService } from '@services/interface'
import { Request, Response, NextFunction } from 'express'

export class LeaderboardController implements ILeaderboardController {
    constructor(private _leaderboardService: ILeaderboardService) {}

    async updateRanks(_req: Request, res: Response, _next: NextFunction): Promise<void> {
        await this._leaderboardService.updateRanks()
        res.status(_HttpStatus.OK).json({ message: Messages.RANKS_UPDATED })
    }
}
