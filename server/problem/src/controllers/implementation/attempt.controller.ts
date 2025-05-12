import { _HttpStatus, Messages } from '@constants'
import { IAttemptController } from '@controllers/interface'
import { IAttemptService } from '@services/interface'
import { Request, Response, NextFunction } from 'express'

export class AttemptController implements IAttemptController {
    constructor(private _attemptService: IAttemptService) {}

    async submitSolution(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { language, problemNo } = req.body
            let { code } = req.body
            const { id } = JSON.parse(req.headers['x-user-payload'] as string)

            const languages = ['javascript', 'python']
            if (!languages.includes(language)) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.UNSUPPORTED_LANGUAGE })
                return
            }
            if (!code) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.SOLUTION_REQUIRED })
                return
            }
            if (!problemNo) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INVALID_PROBLEM_NO })
                return
            }

            code = code.replace(/console\.\w+\(.*?\);?/g, '')

            const attempt = await this._attemptService.submitSolution(problemNo, id, code, language)

            res.status(_HttpStatus.OK).json(attempt)
        } catch (err) {
            next(err)
        }
    }

    async getAttempts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = JSON.parse(req.headers['x-user-payload'] as string)
            const { problemNo } = req.params
            if (isNaN(Number(problemNo))) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.PROBLEM_NOT_FOUND })
                return
            }
            const attempts = await this._attemptService.getAttempts(id, Number(problemNo))
            res.status(_HttpStatus.OK).json({ attempts })
        } catch (err) {
            next(err)
        }
    }

    async findAttempt(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { attemptId } = req.params
            const attempt = await this._attemptService.findAttempt(attemptId)
            res.status(_HttpStatus.OK).json({ attempt })
        } catch (err) {
            next(err)
        }
    }

    async getProfileStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params
            const { id } = JSON.parse(req.headers['x-user-payload'] as string)
            const stats = await this._attemptService.getProfileStats(userId ? userId : id)
            res.status(_HttpStatus.OK).json({ stats })
        } catch (err) {
            next(err)
        }
    }

    async getAttemptsPerDay(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params
            const { id } = JSON.parse(req.headers['x-user-payload'] as string)
            const attemptsPerDay = await this._attemptService.getAttemptsPerDay(userId ? userId : id)
            res.status(_HttpStatus.OK).json({ attemptsPerDay })
        } catch (err) {
            next(err)
        }
    }

    async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await this._attemptService.getStats()
            res.status(_HttpStatus.OK).json(stats)
        } catch (err) {
            next(err)
        }
    }
}
