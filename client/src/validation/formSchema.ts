import Messages from "@/constants/Messages";
import { nameRegex, emailRegex, passwordRegex } from "./regex";

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
