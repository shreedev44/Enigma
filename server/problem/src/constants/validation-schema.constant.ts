import { Regex, Messages } from '@constants'
import { isValidFunctionString } from '@utils'

const problemUpdateValidationSchema = {
    title: {
        rules: [Regex.NAME],
        messages: [Messages.TITLE_REQUIRED],
        optional: true,
    },
    difficulty: {
        rules: [(value: string) => ['Beginner', 'Intermediate', 'Advanced'].includes(value)],
        messages: [Messages.DIFFICULTY_REQUIRED],
        optional: true,
    },
    description: {
        rules: [(value: string) => value.length > 0],
        messages: [Messages.DESCRIPTION_REQUIRED],
        optional: true,
    },
    functionName: {
        rules: [Regex.CAMEL_CASE],
        messages: [Messages.FUNCTION_NAME_REQUIRED],
        optional: true,
    },
    parameters: {
        rules: [(value: unknown[]) => Array.isArray(value) && value.length > 0],
        messages: [Messages.NOT_ENOUGHT_PARAMS],
        optional: true,
    },
    functionReturnType: {
        rules: [(value: string) => ['Array', 'Floating Point', 'Integer', 'String', 'Boolean'].includes(value)],
        messages: [Messages.FUNCTION_RETURN_REQUIRED],
        optional: true,
    },
    functionReturnElemType: {
        rules: [
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (value: string, data: any) =>
                data.functionReturnType === 'Array'
                    ? ['Array', 'Floating Point', 'Integer', 'String', 'Boolean'].includes(value)
                    : true,
        ],
        messages: [Messages.FUNCTION_RETURN_ELEMENT_REQUIRED],
        optional: true,
    },
    functionReturnNestedType: {
        rules: [
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (value: string, data: any) =>
                data.functionReturnType === 'Array'
                    ? ['Array', 'Floating Point', 'Integer', 'String', 'Boolean'].includes(value)
                    : true,
        ],
        messages: [Messages.FUNCTION_RETURN_NESTED_REQUIRED],
        optional: true,
    },
    evalFunction: {
        rules: [(value: string) => isValidFunctionString(value)],
        messages: [Messages.EVAL_FUNCTION_REQUIRED],
        optional: true,
    },
}

const problemCreateValidationSchema = {
    title: {
        rules: [Regex.NAME],
        messages: [Messages.TITLE_REQUIRED],
        optional: true,
    },
    difficulty: {
        rules: [(value: string) => ['Beginner', 'Intermediate', 'Advanced'].includes(value)],
        messages: [Messages.DIFFICULTY_REQUIRED],
        optional: true,
    },
    description: {
        rules: [(value: string) => value.length > 0],
        messages: [Messages.DESCRIPTION_REQUIRED],
        optional: true,
    },
    functionName: {
        rules: [Regex.CAMEL_CASE],
        messages: [Messages.FUNCTION_NAME_REQUIRED],
        optional: true,
    },
    parameters: {
        rules: [(value: unknown[]) => Array.isArray(value) && value.length > 0],
        messages: [Messages.NOT_ENOUGHT_PARAMS],
        optional: true,
    },
    functionReturnType: {
        rules: [(value: string) => ['Array', 'Floating Point', 'Integer', 'String', 'Boolean'].includes(value)],
        messages: [Messages.FUNCTION_RETURN_REQUIRED],
        optional: true,
    },
    functionReturnElemType: {
        rules: [
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (value: string, data: any) =>
                data.functionReturnType === 'Array'
                    ? ['Array', 'Floating Point', 'Integer', 'String', 'Boolean'].includes(value)
                    : true,
        ],
        messages: [Messages.FUNCTION_RETURN_ELEMENT_REQUIRED],
        optional: true,
    },
    functionReturnNestedType: {
        rules: [
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (value: string, data: any) =>
                data.functionReturnType === 'Array'
                    ? ['Array', 'Floating Point', 'Integer', 'String', 'Boolean'].includes(value)
                    : true,
        ],
        messages: [Messages.FUNCTION_RETURN_NESTED_REQUIRED],
        optional: true,
    },
    evalFunction: {
        rules: [(value: string) => isValidFunctionString(value)],
        messages: [Messages.EVAL_FUNCTION_REQUIRED],
        optional: true,
    },
}

export const validationSchemas = {
    problemUpdateValidationSchema,
    problemCreateValidationSchema,
}
