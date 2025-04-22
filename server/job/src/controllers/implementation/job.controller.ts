import { NextFunction, Request, Response } from 'express'
import { _HttpStatus, Messages } from '@constants'
import { IJobService } from '@services/interface'
import { IJobController } from '@controllers/interface'

export class JobController implements IJobController {
    constructor(private _jobService: IJobService) {}

    async createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)
            const jobData = req.body

            if (!userId || !jobData) {
                res.status(_HttpStatus.BAD_REQUEST).json({
                    message: Messages.INCOMPLETE_FORM,
                })
                return
            }

            const job = await this._jobService.createJob(userId, jobData)
            res.status(_HttpStatus.CREATED).json({ job })
        } catch (err) {
            next(err)
        }
    }

    async updateJob(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)
            const { jobId } = req.params
            const jobData = req.body

            if (!userId || !jobId || !jobData) {
                res.status(_HttpStatus.BAD_REQUEST).json({
                    message: Messages.INCOMPLETE_FORM,
                })
                return
            }

            const updatedJob = await this._jobService.updateJob(userId, jobId, jobData)

            if (!updatedJob) {
                res.status(_HttpStatus.NOT_FOUND).json({
                    message: Messages.JOB_NOT_FOUND,
                })
                return
            }

            res.status(_HttpStatus.OK).json({ updatedJob })
        } catch (err) {
            next(err)
        }
    }

    async deleteJob(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)
            const { jobId } = req.params

            if (!userId || !jobId) {
                res.status(_HttpStatus.BAD_REQUEST).json({
                    message: Messages.INCOMPLETE_FORM,
                })
                return
            }

            const isDeleted = await this._jobService.deleteJob(userId, jobId)

            if (!isDeleted) {
                res.status(_HttpStatus.NOT_FOUND).json({
                    message: Messages.JOB_NOT_FOUND,
                })
                return
            }

            res.status(_HttpStatus.OK).json({
                message: Messages.JOB_DELETED,
            })
        } catch (err) {
            next(err)
        }
    }

    async getJobsByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)

            if (!userId) {
                res.status(_HttpStatus.BAD_REQUEST).json({
                    message: Messages.INCOMPLETE_FORM,
                })
                return
            }

            const jobs = await this._jobService.getJobsByUserId(userId)

            res.status(_HttpStatus.OK).json({ jobs })
        } catch (err) {
            next(err)
        }
    }

    async getAllJobs(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const jobs = await this._jobService.getAllJobs()
            res.status(_HttpStatus.OK).json({ jobs })
        } catch (err) {
            next(err)
        }
    }
}
