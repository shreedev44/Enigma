import { _HttpStatus, Messages } from '@constants'
import { IBlacklistController } from '@controllers/interface'
import { IBlacklistService } from '@services/interface'
import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'

export class BlacklistController implements IBlacklistController {
    constructor(private _blacklistService: IBlacklistService) {}

    async blacklistApplicant(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { applicantId, applicantName } = req.body
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)

            if (!applicantId || !applicantName) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INCOMPLETE_FORM })
                return
            }

            if (!Types.ObjectId.isValid(applicantId)) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_ID })
                return
            }

            await this._blacklistService.blackListApplicant(applicantId, userId, applicantName)
            res.status(_HttpStatus.OK).json({ message: Messages.BLACKLISTED })
        } catch (err) {
            next(err)
        }
    }

    async getBlacklist(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)

            const applicants = await this._blacklistService.getBlacklistOfRecruiter(userId)

            res.status(_HttpStatus.OK).json({ applicants })
        } catch (err) {
            next(err)
        }
    }

    async removeFromBlacklist(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)
            const { applicantId } = req.body

            await this._blacklistService.removeFromBlacklist(userId, applicantId)
            res.status(_HttpStatus.OK).json({ message: Messages.REMOVED_FROM_BLACKLISTED })
        } catch (err) {
            next(err)
        }
    }
}
