import { Messages, Regex } from '@constants'

const loginValidationSchema = {
    email: {
        rules: [Regex.EMAIL],
        messages: [Messages.INVALID_EMAIL],
    },
    password: {
        rules: [Regex.PASSWORD.minLength, Regex.PASSWORD.letter, Regex.PASSWORD.digit, Regex.PASSWORD.specialChar],
        messages: [
            Messages.PASSWORD_LENGTH,
            Messages.PASSWORD_LETTER,
            Messages.PASSWORD_DIGIT,
            Messages.PASSWORD_SPECIALCHAR,
        ],
    },
}

const studentSignupValidationSchema = {
    firstName: {
        rules: [Regex.NAME],
        messages: [Messages.INVALID_NAME],
    },
    lastName: {
        rules: [Regex.NAME],
        messages: [Messages.INVALID_NAME],
    },
    email: {
        rules: [Regex.EMAIL],
        messages: [Messages.INVALID_EMAIL],
    },
    password: {
        rules: [Regex.PASSWORD.minLength, Regex.PASSWORD.letter, Regex.PASSWORD.digit, Regex.PASSWORD.specialChar],
        messages: [
            Messages.PASSWORD_LENGTH,
            Messages.PASSWORD_LETTER,
            Messages.PASSWORD_DIGIT,
            Messages.PASSWORD_SPECIALCHAR,
        ],
    },
}

const studentProfileValidationSchema = {
    firstName: {
        rules: [Regex.NAME],
        messages: [Messages.INVALID_NAME],
        optional: true,
    },
    lastName: {
        rules: [Regex.OPTIONAL_NAME],
        messages: [Messages.INVALID_NAME],
        optional: true,
    },
    githubProfile: {
        rules: [Regex.OPTIONAL_GITHUB],
        messages: [Messages.INVALID_GITHUB],
        optional: true,
    },
    linkedinProfile: {
        rules: [Regex.OPTIONAL_LINKEDIN],
        messages: [Messages.INVALID_LINKEDIN],
        optional: true,
    },
}

const recruiterSignupValidation = {
    companyName: {
        rules: [Regex.NAME],
        messages: [Messages.INVALID_NAME],
    },
    email: {
        rules: [Regex.EMAIL],
        messages: [Messages.INVALID_EMAIL],
    },
    password: {
        rules: [Regex.PASSWORD.minLength, Regex.PASSWORD.letter, Regex.PASSWORD.digit, Regex.PASSWORD.specialChar],
        messages: [
            Messages.PASSWORD_LENGTH,
            Messages.PASSWORD_LETTER,
            Messages.PASSWORD_DIGIT,
            Messages.PASSWORD_SPECIALCHAR,
        ],
    },
}

const recruiterProfileValidationSchema = {
    companyName: {
        rules: [Regex.NAME],
        messages: [Messages.INVALID_NAME],
        optional: true,
    },
    bio: {
        rules: [Regex.OPTIONAL_BIO],
        messages: [Messages.INVALID_BIO],
        optional: true,
    },
    facebookProfile: {
        rules: [Regex.OPTIONAL_FACEBOOK],
        messages: [Messages.INVALID_FACEBOOK],
        optional: true,
    },
    linkedinProfile: {
        rules: [Regex.OPTIONAL_LINKEDIN],
        messages: [Messages.INVALID_LINKEDIN],
        optional: true,
    },
    twitterProfile: {
        rules: [Regex.OPTIONAL_TWITTER],
        messages: [Messages.INVALID_TWITTER],
        optional: true,
    },
    basedAt: {
        rules: [Regex.OPTIONAL_BASED_AT],
        messages: [Messages.INVALID_BASED_AT],
        optional: true,
    },
}

export const validationSchemas = {
    loginValidationSchema,
    studentSignupValidationSchema,
    recruiterSignupValidation,
    studentProfileValidationSchema,
    recruiterProfileValidationSchema,
}
