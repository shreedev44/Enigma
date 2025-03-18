const NAME = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/
const OPTIONAL_NAME = /^(?:[a-zA-Z]+(?: [a-zA-Z]+)*|)$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD = {
  letter: /[a-zA-Z]/,
  minLength: /^.{8,}$/,
  digit: /\d/,
  specialChar: /[!@#$%^&*(),.?":{}|<>+-]/,
}
const OPTIONAL_GITHUB =
  /^(?:https:\/\/github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?)|)$/
const OPTIONAL_LINKEDIN = /^(?:https:\/\/(www\.)?linkedin\.com\/in\/.+|)$/
const OPTIONAL_BIO = /^(?!\s)(?:[\s\S]{100,600}|)$/
const OPTIONAL_FACEBOOK =
  /^(?:https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+(?:\?.*)?|)$/
const OPTIONAL_TWITTER =
  /^(?:https:\/\/(www\.)?x\.com\/[a-zA-Z0-9_]+(?:\?.*)?|)$/
const OPTIONAL_BASED_AT =
  /^(?:[A-Za-z]+(?: [A-Za-z]+)*(?:, [A-Za-z]+(?: [A-Za-z]+)*)*|){3,50}$/

export const Regex = {
  NAME,
  OPTIONAL_NAME,
  EMAIL,
  PASSWORD,
  OPTIONAL_GITHUB,
  OPTIONAL_LINKEDIN,
  OPTIONAL_BIO,
  OPTIONAL_FACEBOOK,
  OPTIONAL_TWITTER,
  OPTIONAL_BASED_AT,
}
