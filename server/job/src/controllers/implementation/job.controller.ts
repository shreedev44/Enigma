import { NextFunction, Request, Response } from 'express'
import { _HttpStatus, Messages } from '@constants'
import { IJobService } from '@services/interface'
import { IJobController } from '@controllers/interface'
import { Types } from 'mongoose'

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

            if (!Types.ObjectId.isValid(jobId)) {
                res.status(_HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_ID })
                return
            }

            const updatedJob = await this._jobService.updateJob(userId, jobId, jobData)

            if (!updatedJob) {
                res.status(_HttpStatus.NOT_FOUND).json({
                    message: Messages.JOB_NOT_FOUND,
                })
                return
            }

            res.status(_HttpStatus.OK).json({ message: Messages.JOB_UPDATED })
        } catch (err) {
            next(err)
        }
    }

    async deleteJob(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId, role } = JSON.parse(req.headers['x-user-payload'] as string)
            const { jobId } = req.params

            if (!userId || !jobId) {
                res.status(_HttpStatus.BAD_REQUEST).json({
                    message: Messages.INCOMPLETE_FORM,
                })
                return
            }

            if (!Types.ObjectId.isValid(jobId)) {
                res.status(_HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_ID })
                return
            }

            let isAdmin = false
            if (role === 'admin') isAdmin = true

            const isDeleted = await this._jobService.deleteJob(userId, jobId, isAdmin)

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
            const { page = 1 } = req.query

            if (isNaN(Number(page))) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_PAGE })
                return
            }

            if (!userId) {
                res.status(_HttpStatus.BAD_REQUEST).json({
                    message: Messages.INCOMPLETE_FORM,
                })
                return
            }

            const { jobs, totalPages } = await this._jobService.getJobsByUserId(userId, Number(page))

            res.status(_HttpStatus.OK).json({ jobs, totalPages })
        } catch (err) {
            next(err)
        }
    }

    async getAllJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = 1, sortBy = 'updatedAt', sortOrder = -1, filter = '', userId = '' } = req.query
            if (isNaN(Number(page))) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_PAGE })
                return
            }
            const sortOptions = ['companyName', 'updatedAt', 'title']
            if (!sortOptions.includes(String(sortBy))) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_SORT_OPTION })
                return
            }
            if (Number(sortOrder) !== 1 && Number(sortOrder) !== -1) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_SORT_ORDER })
                return
            }
            if (userId && !Types.ObjectId.isValid(String(userId))) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_ID })
                return
            }

            let isAdmin = false
            if (req.headers['x-user-payload']) {
                const { role } = JSON.parse(req.headers['x-user-payload'] as string)
                if (role === 'admin') {
                    isAdmin = true
                }
            }
            const { jobs, totalPages } = await this._jobService.getAllJobs(
                Number(page),
                String(sortBy),
                Number(sortOrder) as 1 | -1,
                String(filter),
                String(userId),
                isAdmin
            )
            res.status(_HttpStatus.OK).json({ jobs, totalPages })
        } catch (err) {
            next(err)
        }
    }

    async getJobDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { jobId } = req.params

            if (!jobId) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INCOMPLETE_FORM })
                return
            }

            if (!Types.ObjectId.isValid(jobId)) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_ID })
                console.log('---------------------------------getjobdetails')
                return
            }

            const result = await this._jobService.getJobDetails(jobId)
            res.status(_HttpStatus.OK).json(result)
        } catch (err) {
            next(err)
        }
    }

    async getJobStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this._jobService.getJobStats()
            res.status(_HttpStatus.OK).json({ result })
        } catch (err) {
            next(err)
        }
    }
}
