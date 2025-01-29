import Messages from "@/constants/Messages";
import { nameRegex, emailRegex, passwordRegex, optionalNameRegex, optionalGithubRegex, optionalLinkedinRegex } from "./regex";

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

}

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
