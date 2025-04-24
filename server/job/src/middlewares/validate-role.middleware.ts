import { _HttpStatus, Messages } from '@constants'
import { NextFunction, Request, Response } from 'express'

export const validateRole = (userLevel: 'student' | 'recruiter' | 'admin') => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (userLevel !== req.headers['x-user-level']) {
            res.status(_HttpStatus.UNAUTHORIZED).json({ error: Messages.UNAUTHORIZED })
            return
        }
        next()
    }
}
