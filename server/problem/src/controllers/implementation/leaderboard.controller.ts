import { _HttpStatus, Messages } from '@constants'
import { ILeaderboardController } from '@controllers/interface'
import { ILeaderboardService } from '@services/interface'
import { Request, Response, NextFunction } from 'express'

export class LeaderboardController implements ILeaderboardController {
    constructor(private _leaderboardService: ILeaderboardService) {}

    async updateRanks(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this._leaderboardService.updateRanks()
            res.status(_HttpStatus.OK).json({ message: Messages.RANKS_UPDATED })
        } catch (err) {
            next(err)
        }
    }

    async getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = 1 } = req.query
            let userId: null | string = null
            if (req.headers['x-user-payload']) {
                const { id } = JSON.parse(req.headers['x-user-payload'] as string)
                userId = id
            }
            if (isNaN(Number(page))) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_PAGE })
                return
            }
            const result = await this._leaderboardService.getLeaderboard(Number(page), userId)
            res.status(_HttpStatus.OK).json(result)
        } catch (err) {
            next(err)
        }
    }
}
