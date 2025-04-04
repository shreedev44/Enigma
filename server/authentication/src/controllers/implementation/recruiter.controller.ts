import { NextFunction, Request, Response } from 'express'
import { _HttpStatus, Messages } from '@constants'
import { IRecruiterService } from '@services/interface'
import { IRecruiterController } from '@controllers/interface'
import { FileType } from '@types'

export class RecruiterController implements IRecruiterController {
    constructor(private _recruiterService: IRecruiterService) {}

    async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = JSON.parse(req.headers['x-user-payload'] as string)
            if (!id) {
                res.status(_HttpStatus.BAD_REQUEST).json({
                    message: Messages.INCOMPLETE_FORM,
                })
                return
            }

            const profile = await this._recruiterService.getProfile(id as string)

            res.status(_HttpStatus.OK).json({ profile })
        } catch (err) {
            next(err)
        }
    }

    async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData = req.body
            const { id } = JSON.parse(req.headers['x-user-payload'] as string)
            const profilePicture = req.file
            const profile = await this._recruiterService.updateProfile(
                id,
                userData,
                profilePicture as FileType | undefined
            )
            res.status(_HttpStatus.OK).json({ profile })
        } catch (err) {
            next(err)
        }
    }
}
