import { Regex, Messages } from '@constants'

const jobCreationValidationSchema = {
    role: {
        rules: [Regex.ROLE],
        messages: [Messages.INVALID_ROLE],
    },
    workTime: {
        rules: [Regex.WORK_TIME],
        messages: [Messages.INVALID_WORK_TIME],
    },
    workMode: {
        rules: [Regex.WORK_MODE],
        messages: [Messages.INVALID_WORK_MODE],
    },
    jobLocation: {
        rules: [Regex.JOB_LOCATION],
        messages: [Messages.INVALID_JOB_LOCATION],
    },
    minimumExperience: {
        rules: [Regex.MINIMUM_EXPERIENCE],
        messages: [Messages.INVALID_MINIMUM_EXPERIENCE],
    },
    minSalary: {
        rules: [Regex.SALARY],
        messages: [Messages.INVALID_SALARY],
        optional: true,
    },
    maxSalary: {
        rules: [Regex.SALARY],
        messages: [Messages.INVALID_SALARY],
        optional: true,
    },
    requirements: {
        rules: [Regex.REQUIREMENTS],
        messages: [Messages.INVALID_REQUIREMENTS],
    },
    responsibilities: {
        rules: [Regex.RESPONSIBILITIES],
        messages: [Messages.INVALID_RESPONSIBILITIES],
    },
    lastDate: {
        rules: [Regex.LAST_DATE],
        messages: [Messages.INVALID_LAST_DATE],
    },
}

const jobUpdateValidationSchema = {
    role: {
        rules: [Regex.ROLE],
        messages: [Messages.INVALID_ROLE],
        optional: true,
    },
    workTime: {
        rules: [Regex.WORK_TIME],
        messages: [Messages.INVALID_WORK_TIME],
        optional: true,
    },
    workMode: {
        rules: [Regex.WORK_MODE],
        messages: [Messages.INVALID_WORK_MODE],
        optional: true,
    },
    jobLocation: {
        rules: [Regex.JOB_LOCATION],
        messages: [Messages.INVALID_JOB_LOCATION],
        optional: true,
    },
    minimumExperience: {
        rules: [Regex.MINIMUM_EXPERIENCE],
        messages: [Messages.INVALID_MINIMUM_EXPERIENCE],
        optional: true,
    },
    minSalary: {
        rules: [Regex.SALARY],
        messages: [Messages.INVALID_SALARY],
        optional: true,
    },
    maxSalary: {
        rules: [Regex.SALARY],
        messages: [Messages.INVALID_SALARY],
        optional: true,
    },
    requirements: {
        rules: [Regex.REQUIREMENTS],
        messages: [Messages.INVALID_REQUIREMENTS],
        optional: true,
    },
    responsibilities: {
        rules: [Regex.RESPONSIBILITIES],
        messages: [Messages.INVALID_RESPONSIBILITIES],
        optional: true,
    },
    lastDate: {
        rules: [Regex.LAST_DATE],
        messages: [Messages.INVALID_LAST_DATE],
        optional: true,
    },
}

export const validationSchemas = {
    jobCreationValidationSchema,
    jobUpdateValidationSchema,
}
