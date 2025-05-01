import { NextFunction, Request, Response } from 'express'
import { _HttpStatus, Messages } from '@constants'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValidationRule = RegExp | ((value: any, data?: Record<string, any>) => boolean)

interface ValidationField {
    rules: ValidationRule[]
    messages: string[]
    optional?: boolean
}

type ValidationSchema = Record<string, ValidationField>

export const validateData = (validationSchema: ValidationSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const data = req.body

        for (const field in validationSchema) {
            const value = data[field]

            if (value === undefined && validationSchema[field].optional) continue

            if (value === undefined) {
                res.status(_HttpStatus.BAD_REQUEST).json({ error: Messages.INCOMPLETE_FORM, field })
                return
            }

            const { rules, messages } = validationSchema[field]

            for (const [index, rule] of rules.entries()) {
                const isValid = typeof rule === 'function' ? rule(value, data) : rule.test(value)
                if (!isValid) {
                    res.status(_HttpStatus.BAD_REQUEST).json({ error: messages[index], field })
                    return
                }
            }
        }
        next()
    }
}
