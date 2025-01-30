const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
const optionalNameRegex = /^(?:[a-zA-Z]+(?: [a-zA-Z]+)*|)$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = {
  letter: /[a-zA-Z]/,
  minLength: /^.{8,}$/,
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
};
