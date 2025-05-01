import Messages from "@/constants/Messages";
import {
	nameRegex,
	emailRegex,
	passwordRegex,
	optionalNameRegex,
	optionalGithubRegex,
	optionalLinkedinRegex,
	optionalBioRegex,
	optionalFacebookRegex,
	optionalTwitterRegex,
	optionalBasedAtRegex,
	JobRegex,
	camelCaseRegex,
} from "./regex";

export const studentSignupValidationSchema = {
	firstName: {
		rules: [nameRegex],
		messages: [Messages.INVALID_NAME],
	},
	lastName: {
		rules: [nameRegex],
		messages: [Messages.INVALID_NAME],
	},
	email: {
		rules: [emailRegex],
		messages: [Messages.INVALID_EMAIL],
	},
	password: {
		rules: [
			passwordRegex["length"],
			passwordRegex.letter,
			passwordRegex.digit,
			passwordRegex.specialChar,
		],
		messages: [
			Messages.PASSWORD_LENGTH,
			Messages.PASSWORD_LETTER,
			Messages.PASSWORD_DIGIT,
			Messages.PASSWORD_SPECIALCHAR,
		],
	},
};

export const studentProfileValidationSchema = {
	firstName: {
		rules: [nameRegex],
		messages: [Messages.INVALID_NAME],
	},
	lastName: {
		rules: [optionalNameRegex],
		messages: [Messages.INVALID_NAME],
		optional: true,
	},
	githubProfile: {
		rules: [optionalGithubRegex],
		messages: [Messages.INVALID_GITHUB],
		optional: true,
	},
	linkedinProfile: {
		rules: [optionalLinkedinRegex],
		messages: [Messages.INVALID_LINKEDIN],
		optional: true,
	},
};

export const recruiterSignupValidationSchema = {
	companyName: {
		rules: [nameRegex],
		messages: [Messages.INVALID_NAME],
	},
	email: {
		rules: [emailRegex],
		messages: [Messages.INVALID_EMAIL],
	},
	password: {
		rules: [
			passwordRegex["length"],
			passwordRegex.letter,
			passwordRegex.digit,
			passwordRegex.specialChar,
		],
		messages: [
			Messages.PASSWORD_LENGTH,
			Messages.PASSWORD_LETTER,
			Messages.PASSWORD_DIGIT,
			Messages.PASSWORD_SPECIALCHAR,
		],
	},
};

export const recruiterProfileValidationSchema = {
	companyName: {
		rules: [nameRegex],
		messages: [Messages.INVALID_NAME],
		optional: true,
	},
	bio: {
		rules: [optionalBioRegex],
		messages: [Messages.INVALID_BIO],
		optional: true,
	},
	facebookProfile: {
		rules: [optionalFacebookRegex],
		messages: [Messages.INVALID_FACEBOOK],
		optional: true,
	},
	linkedinProfile: {
		rules: [optionalLinkedinRegex],
		messages: [Messages.INVALID_LINKEDIN],
		optional: true,
	},
	twitterProfile: {
		rules: [optionalTwitterRegex],
		messages: [Messages.INVALID_TWITTER],
		optional: true,
	},
	basedAt: {
		rules: [optionalBasedAtRegex],
		messages: [Messages.INVALID_BASED_AT],
		optional: true,
	},
};

export const loginValidationSchema = {
	email: {
		rules: [emailRegex],
		messages: [Messages.INVALID_EMAIL],
	},
	password: {
		rules: [
			passwordRegex["length"],
			passwordRegex.letter,
			passwordRegex.digit,
			passwordRegex.specialChar,
		],
		messages: [
			Messages.PASSWORD_LENGTH,
			Messages.PASSWORD_LETTER,
			Messages.PASSWORD_DIGIT,
			Messages.PASSWORD_SPECIALCHAR,
		],
	},
};

export const jobCreationValidationSchema = {
	role: {
		rules: [JobRegex.roleRegex],
		messages: [Messages.INVALID_ROLE],
	},
	workTime: {
		rules: [JobRegex.workTimeRegex],
		messages: [Messages.INVALID_WORK_TIME],
	},
	workMode: {
		rules: [JobRegex.workModeRegex],
		messages: [Messages.INVALID_WORK_MODE],
	},
	jobLocation: {
		rules: [JobRegex.jobLocationRegex],
		messages: [Messages.INVALID_JOB_LOCATION],
	},
	minimumExperience: {
		rules: [
			JobRegex.minExperienceRegex.type,
			JobRegex.minExperienceRegex.amount,
		],
		messages: [
			Messages.INVALID_MINIMUM_EXPERIENCE,
			Messages.INVALID_MINIMUM_EXPERIENCE,
		],
	},
	requirements: {
		rules: [JobRegex.requirementRegex],
		messages: [Messages.INVALID_REQUIREMENTS],
	},
	responsibilities: {
		rules: [JobRegex.responsibilityRegex],
		messages: [Messages.INVALID_RESPONSIBILITIES],
	},
	lastDate: {
		rules: [JobRegex.lastDateRegex],
		messages: [Messages.INVALID_LAST_DATE],
	},
};

export const jobUpdationValidationSchema = {
	role: {
		rules: [JobRegex.roleRegex],
		messages: [Messages.INVALID_ROLE],
		optional: true,
	},
	workTime: {
		rules: [JobRegex.workTimeRegex],
		messages: [Messages.INVALID_WORK_TIME],
		optional: true,
	},
	workMode: {
		rules: [JobRegex.workModeRegex],
		messages: [Messages.INVALID_WORK_MODE],
		optional: true,
	},
	jobLocation: {
		rules: [JobRegex.jobLocationRegex],
		messages: [Messages.INVALID_JOB_LOCATION],
		optional: true,
	},
	minimumExperience: {
		rules: [
			JobRegex.minExperienceRegex.type,
			JobRegex.minExperienceRegex.amount,
		],
		messages: [
			Messages.INVALID_MINIMUM_EXPERIENCE,
			Messages.INVALID_MINIMUM_EXPERIENCE,
		],
		optional: true,
	},
	requirements: {
		rules: [JobRegex.requirementRegex],
		messages: [Messages.INVALID_REQUIREMENTS],
		optional: true,
	},
	responsibilities: {
		rules: [JobRegex.responsibilityRegex],
		messages: [Messages.INVALID_RESPONSIBILITIES],
		optional: true,
	},
	lastDate: {
		rules: [JobRegex.lastDateRegex],
		messages: [Messages.INVALID_LAST_DATE],
		optional: true,
	},
};

export const problemUpdationSchema = {
	title: {
		rules: [
			(value: unknown) => typeof value === "string" && value.trim().length > 0,
		],
		messages: ["Please provide a valid title"],
		optional: true,
	},
	difficulty: {
		rules: [
			(value: unknown) =>
				typeof value === "string" &&
				["Beginner", "Intermediate", "Advanced"].includes(value),
		],
		messages: ["Please provide a valid difficulty"],
		optional: true,
	},
	description: {
		rules: [
			(value: unknown) => typeof value === "string" && value.trim().length > 0,
		],
		messages: ["Please provide a description"],
		optional: true,
	},
	functionName: {
		rules: [
			(value: unknown) =>
				typeof value === "string" && camelCaseRegex.test(value.trim()),
		],
		messages: ["Please provide a valid function name (camelCase)"],
		optional: true,
	},
	parameters: {
		rules: [
			(value: unknown) =>
				Array.isArray(value) && value.length > 0 && value.length <= 5,
		],
		messages: ["Please provide valid parameters (1-5 allowed)"],
		optional: true,
	},
	functionReturnType: {
		rules: [
			(value: unknown) =>
				typeof value === "string" &&
				["Array", "Floating Point", "Integer", "String", "Boolean"].includes(
					value
				),
		],
		messages: ["Please provide a valid function return type"],
		optional: true,
	},
	functionReturnElemType: {
		rules: [
			(value: unknown, form: Record<string, unknown>) =>
				form.functionReturnType === "Array"
					? typeof value === "string" && value.trim().length > 0
					: true,
		],
		messages: ["Please provide a valid function return element type"],
		optional: true,
	},
	functionReturnNestedType: {
		rules: [
			(value: unknown, form: Record<string, unknown>) =>
				form.functionReturnType === "Array"
					? typeof value === "string" && value.trim().length > 0
					: true,
		],
		messages: ["Please provide a valid function return nested type"],
		optional: true,
	},
	evalFunction: {
		rules: [
			(value: unknown) => {
				if (typeof value !== "string") return false;
				try {
					new Function(`return ${value}`)();
					return true;
				} catch {
					return false;
				}
			},
		],
		messages: ["Please provide a valid evaluating function"],
		optional: true,
	},
};

export const problemCreationSchema = {
	title: {
		rules: [nameRegex],
		messages: ["Please provide a valid title"],
	},
	difficulty: {
		rules: [
			(value: string) =>
				["Beginner", "Intermediate", "Advanced"].includes(value),
		],
		messages: ["Please provide a valid difficulty"],
	},
	description: {
		rules: [(value: string) => !!value],
		messages: ["Please provide a description"],
	},
	functionName: {
		rules: [camelCaseRegex],
		messages: ["Please provide a valid function name (camelCase)"],
	},
	parameters: {
		rules: [(value: unknown[]) => value?.length > 0],
		messages: ["Please provide at least one parameter"],
	},
	functionReturnType: {
		rules: [
			(value: string) =>
				[
					"Array",
					"Floating Point",
					"Integer",
					"String",
					"Boolean",
				].includes(value),
		],
		messages: ["Please provide a valid function return type"],
	},
	functionReturnElemType: {
		rules: [
			(value: string, form: Record<string, unknown>) =>
				form.functionReturnType === "Array" ? !!value : true,
		],
		messages: ["Please provide a valid function return element type"],
		optional: true,
	},
	functionReturnNestedType: {
		rules: [
			(value: string, form: Record<string, unknown>) =>
				form.functionReturnType === "Array" ? !!value : true,
		],
		messages: ["Please provide a valid function return nested type"],
		optional: true,
	},
	evalFunction: {
		rules: [
			(value: string) => {
				try {
					new Function(`return ${value}`)();
					return true;
				} catch {
					return false;
				}
			},
		],
		messages: ["Please provide a valid evaluating function"],
	},
};
