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

            await this._applicationService.createApplication(userId, jobId, file)
            res.status(_HttpStatus.CREATED).json({ message: Messages.APPLICATION_SUCCESS })
        } catch (err) {
            next(err)
        }
    }

    async deleteApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)
            const { applicationId } = req.params

            if (!applicationId) {
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
            const { page = 1 } = req.query

            if (isNaN(Number(page))) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_PAGE })
                return
            }

            const { applications, totalPages } = await this._applicationService.getApplicationsByUserId(
                userId,
                Number(page)
            )

            res.status(_HttpStatus.OK).json({ applications, totalPages })
        } catch (err) {
            next(err)
        }
    }

    async getApplicationsByJob(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { jobId } = req.params
            const { page = 1 } = req.query
            const { tags = [] } = req.body

            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)

            if (isNaN(Number(page))) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_PAGE })
                return
            }

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

            const { applications, totalPages } = await this._applicationService.getApplicationsByJobId(
                jobId,
                userId,
                Number(page),
                tags
            )

            res.status(_HttpStatus.OK).json({ applications, totalPages })
        } catch (err) {
            next(err)
        }
    }

    async shortlistApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { jobId } = req.params
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)
            const { tags = [] } = req.body

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

            const { shortlisted } = await this._applicationService.shortlistApplications(jobId, userId, tags)
            res.status(_HttpStatus.OK).json({ message: Messages.SHORTLISTED(shortlisted) })
        } catch (err) {
            next(err)
        }
    }

    async getShortlist(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { jobId } = req.params
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)
            const { page = 1 } = req.query

            if (isNaN(Number(page))) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_PAGE })
                return
            }

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

            const result = await this._applicationService.getShortlist(jobId, userId, Number(page))
            res.status(_HttpStatus.OK).json(result)
        } catch (err) {
            next(err)
        }
    }

    async getApplicationDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { jobId, applicationId } = req.params
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)

            if (!jobId || !applicationId) {
                res.status(_HttpStatus.BAD_REQUEST).json({
                    message: Messages.INCOMPLETE_FORM,
                })
                return
            }

            if (!Types.ObjectId.isValid(jobId) || !Types.ObjectId.isValid(applicationId)) {
                res.status(_HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_ID })
                return
            }

            const application = await this._applicationService.getApplicationDetails(applicationId, jobId, userId)
            res.status(_HttpStatus.OK).json(application)
        } catch (err) {
            next(err)
        }
    }

    async getResumeUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { jobId, applicationId } = req.params
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)

            if (!jobId || !applicationId) {
                res.status(_HttpStatus.BAD_REQUEST).json({
                    error: Messages.INCOMPLETE_FORM,
                })
                return
            }

            if (!Types.ObjectId.isValid(jobId) || !Types.ObjectId.isValid(applicationId)) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_ID })
                return
            }

            const url = await this._applicationService.getResumeUrl(applicationId, jobId, userId)
            res.status(_HttpStatus.OK).json({ url })
        } catch (err) {
            next(err)
        }
    }
}
