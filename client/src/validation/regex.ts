const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
const optionalNameRegex = /^(?:[a-zA-Z]+(?: [a-zA-Z]+)*|)$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = {
	letter: /[a-zA-Z]/,
	length: /^.{8,}$/,
	digit: /\d/,
	specialChar: /[!@#$%^&*(),.?":{}|<>+-]/,
};
const optionalGithubRegex =
	/^(?:https:\/\/github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?)|)$/;
const optionalLinkedinRegex = /^(?:https:\/\/(www\.)?linkedin\.com\/in\/.+|)$/;
const optionalBioRegex = /^(?!\s)(?:[\s\S]{100,600}|)$/;
const optionalFacebookRegex =
	/^(?:https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+(?:\?.*)?|)$/;
const optionalTwitterRegex =
	/^(?:https:\/\/(www\.)?x\.com\/[a-zA-Z0-9_]+(?:\?.*)?|)$/;
const optionalBasedAtRegex =
	/^(?:[A-Za-z]+(?: [A-Za-z]+)*(?:, [A-Za-z]+(?: [A-Za-z]+)*)*|){3,50}$/;
const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;

const roleRegex = /^[a-zA-Z\- ]{3,50}$/;
const workTimeRegex = /^(Full-Time|Part-Time)$/;
const workModeRegex = /^(On-Site|Remote|Hybrid)$/;
const jobLocationRegex = /^[a-zA-Z, ]{3,50}$/;
const minExperienceRegex = {
	type: /^[0-9]{1,2}$/,
	amount: (value: number) => value <= 20,
};
const salaryRegex = /^[0-9]{1,2}$/;
const responsibilityRegex = (responsibilities: string[]) => {
	const regex = /^[\s\S]{3,500}$/;
	return (
		responsibilities.length >= 3 &&
		responsibilities.length <= 100 &&
		responsibilities.every((responsibility) => regex.test(responsibility))
	);
};
const requirementRegex = (requirements: string[]) => {
	const regex = /^[\s\S]{3,500}$/;
	return (
		requirements.length >= 3 &&
		requirements.length <= 100 &&
		requirements.every((requirement) => regex.test(requirement))
	);
};
const lastDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export {
	nameRegex,
	optionalNameRegex,
	emailRegex,
	passwordRegex,
	optionalGithubRegex,
	optionalLinkedinRegex,
	optionalBioRegex,
	optionalFacebookRegex,
	optionalTwitterRegex,
	optionalBasedAtRegex,
	camelCaseRegex,
};

export const JobRegex = {
	nameRegex,
	roleRegex,
	workTimeRegex,
	workModeRegex,
	jobLocationRegex,
	minExperienceRegex,
	salaryRegex,
	responsibilityRegex,
	requirementRegex,
	lastDateRegex,
};
