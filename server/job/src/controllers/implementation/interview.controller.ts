import { NextFunction, Request, Response } from 'express'
import { _HttpStatus, Messages } from '@constants'
import { IInterviewService } from '@services/interface'
import { IInterviewController } from '@controllers/interface'

export class InterviewController implements IInterviewController {
    constructor(private _interviewService: IInterviewService) {}

    async schedule(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)
            const { meetingTime, candidateEmail = '', jobId, applicationId } = req.body

            if (!meetingTime) {
                res.status(_HttpStatus.BAD_REQUEST).json({
                    error: Messages.INCOMPLETE_FORM,
                })
                return
            }

            const result = await this._interviewService.createInterview(
                userId,
                meetingTime,
                candidateEmail,
                jobId,
                applicationId
            )
            res.status(_HttpStatus.CREATED).json({ meetingId: result })
        } catch (err) {
            next(err)
        }
    }

    async getInterviews(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)

            const interviews = await this._interviewService.getAllInterviews(userId)

            res.status(_HttpStatus.OK).json({ interviews })
        } catch (err) {
            next(err)
        }
    }

    async getTotalInterviews(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: userId } = JSON.parse(req.headers['x-user-payload'] as string)

            const result = await this._interviewService.getTotalInterviews(userId)
            res.status(_HttpStatus.OK).json({ result })
        } catch (err) {
            next(err)
        }
    }
}
