import { NextFunction, Request, Response } from 'express'
import { _HttpStatus, Messages } from '@constants'

export const validateData = (
    validationSchema: Record<string, { rules: RegExp[]; messages: string[]; optional?: boolean }>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
    return (req: Request, res: Response, next: NextFunction) => {
        for (const field in validationSchema) {
            const value = req.body[field]

            if (!value && validationSchema[field].optional) continue

            if (!value) {
                return res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INCOMPLETE_FORM })
            }

            const { rules, messages } = validationSchema[field]

            for (const rule of rules) {
                if (!rule.test(value)) {
                    return res.status(_HttpStatus.BAD_REQUEST).json({ error: messages[rules.indexOf(rule)] })
                }
            }
        }
        next()
    }
}
