import {
  nameRegex,
  emailRegex,
  passwordRegex,
  optionalNameRegex,
  optionalGithubRegex,
  optionalLinkedinRegex,
} from "./Regex";
import { Messages } from "../constants/MessageConstants";

const loginValidationSchema = {
  email: {
    rules: [emailRegex],
    messages: [Messages.INVALID_EMAIL],
  },
  password: {
    rules: [
      passwordRegex.minLength,
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

const studentSignupValidationSchema = {
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
      passwordRegex.minLength,
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

const studentProfileValidationSchema = {
  firstName: {
    rules: [nameRegex],
    messages: [Messages.INVALID_NAME],
    optional: true,
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

const recruiterSignupValidation = {
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
      passwordRegex.minLength,
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

export default {
  loginValidationSchema,
  studentSignupValidationSchema,
  recruiterSignupValidation,
  studentProfileValidationSchema,
};
