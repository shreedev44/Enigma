import { validationSchemas } from '@constants'

export const validateApplication = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): null | { field: string; value: any } => {
    const { applicationValidationSchema } = validationSchemas

    for (const field in applicationValidationSchema) {
        const value = data[field]
        const { rules } = applicationValidationSchema[field as keyof typeof applicationValidationSchema]

        if (value === undefined) {
            return { field, value }
        }

        for (const rule of rules) {
            const isValid = typeof rule === 'function' ? rule(value) : rule.test(value)
            if (!isValid) {
                return { field, value }
            }
        }
    }

    return null
}
