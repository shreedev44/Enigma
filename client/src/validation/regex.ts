const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = {
    letter: /[a-zA-Z]/,
    length: /^.{8,}$/,
    digit: /\d/,
    specialChar: /[!@#$%^&*(),.?":{}|<>+-]/
}

export {
    nameRegex,
    emailRegex,
    passwordRegex
}