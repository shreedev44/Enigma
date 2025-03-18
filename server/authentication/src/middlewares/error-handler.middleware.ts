import { Request, Response, NextFunction } from 'express'
import { HttpError } from '@utils'
import { _HttpStatus, Messages } from '@constants'

export const errorHandler = (err: HttpError | Error, _req: Request, res: Response, _next: NextFunction) => {
    let statusCode = 500
    let message = Messages.SERVER_ERROR

    if (err instanceof HttpError) {
        statusCode = err.statusCode
        message = err.message
    } else {
        console.error('Unhandled', err)
    }

    res.status(statusCode).json({ error: message })
}

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
    next(new HttpError(Messages.INVALID_REQUEST, _HttpStatus.NOT_FOUND))
}
