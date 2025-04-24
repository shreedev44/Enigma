import { NextFunction, Request, Response } from 'express'
import { _HttpStatus, Messages } from '@constants'
import { IApplicationService } from '@services/interface'
import { IApplicationController } from '@controllers/interface'
import { Types } from 'mongoose'

export class ApplicationController implements IApplicationController {
    constructor(private _applicationService: IApplicationService) {}

    async apply(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)
            const { jobId } = req.params
            const file = req.file as Express.Multer.File

            if (!file) {
                res.status(_HttpStatus.BAD_REQUEST).json({
                    message: Messages.INCOMPLETE_FORM,
                })
                return
            }

            const application = await this._applicationService.createApplication(userId, jobId, file)
            res.status(_HttpStatus.CREATED).json({ application })
        } catch (err) {
            next(err)
        }
    }

    async deleteApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)
            const { applicationId } = req.params

            if (!userId || !applicationId) {
                res.status(_HttpStatus.BAD_REQUEST).json({
                    message: Messages.INCOMPLETE_FORM,
                })
                return
            }

            if (!Types.ObjectId.isValid(applicationId)) {
                res.status(_HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_ID })
                return
            }

            const isDeleted = await this._applicationService.deleteApplication(userId, applicationId)

            if (!isDeleted) {
                res.status(_HttpStatus.NOT_FOUND).json({
                    message: Messages.APPLICATION_NOT_FOUND,
                })
                return
            }

            res.status(_HttpStatus.OK).json({
                message: Messages.APPLICATION_DELETED,
            })
        } catch (err) {
            next(err)
        }
    }

    async getMyApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)

            if (!userId) {
                res.status(_HttpStatus.BAD_REQUEST).json({
                    message: Messages.INCOMPLETE_FORM,
                })
                return
            }

            const applications = await this._applicationService.getApplicationsByUserId(userId)

            res.status(_HttpStatus.OK).json({ applications })
        } catch (err) {
            next(err)
        }
    }

    async getApplicationByJob(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { jobId } = req.params

            if (!jobId) {
                res.status(_HttpStatus.BAD_REQUEST).json({
                    message: Messages.INCOMPLETE_FORM,
                })
                return
            }

            if (!Types.ObjectId.isValid(jobId)) {
                res.status(_HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_ID })
                return
            }

            const applications = await this._applicationService.getApplicationsByJobId(jobId)

            res.status(_HttpStatus.OK).json({ applications })
        } catch (err) {
            next(err)
        }
    }
}
