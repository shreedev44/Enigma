const ROLE = /^[a-zA-Z\- ]{3,50}$/
const NAME = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/
const WORK_TIME = /^(Full-Time|Part-Time)$/
const WORK_MODE = /^(On-Site|Remote|Hybrid)$/
const JOB_LOCATION = /^[a-zA-Z, ]{3,50}$/
const MINIMUM_EXPERIENCE = /^[0-9]{1,2}$/
const SALARY = /^[0-9]{1,2}$/
const RESPONSIBILITIES = (responsibilities: string[]) => {
    const regex = /^[\s\S]{3,500}$/
    return (
        responsibilities.length >= 3 &&
        responsibilities.length <= 100 &&
        responsibilities.every((responsibility) => regex.test(responsibility))
    )
}
const REQUIREMENTS = (requirements: string[]) => {
    const regex = /^[\s\S]{3,500}$/
    return (
        requirements.length >= 3 &&
        requirements.length <= 100 &&
        requirements.every((requirement) => regex.test(requirement))
    )
}
const LAST_DATE = /^\d{4}-\d{2}-\d{2}$/
const PROFILE_PIC = /^(https?:\/\/[^\s$.?#].[^\s]*)$/
const PHONE = /^(?!(?:\+91[-\s]?|91[-\s]?|0)?0{10}$)(?:\+91[-\s]?|91[-\s]?|0)?[6-9]\d{9}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SUMMARY = /^[\s\S]{10,500}$/
const EDUCATION = (education: { university: string; degree: string; graduationYear: number; cgpa: number }[]) => {
    const universityRegex = /^[a-zA-Z\s,]{3,100}$/
    const degreeRegex = /^[a-zA-Z0-9\s-]{2,100}$/
    const graduationYearRegex = /^(19|20)\d{2}$/
    const cgpaRegex = /^(?:[0-9](?:\.[0-9]{1,2})?|10(?:\.0{1,2})?|0)$/

    return education.every(
        (edu) =>
            universityRegex.test(edu.university) &&
            degreeRegex.test(edu.degree) &&
            graduationYearRegex.test(edu.graduationYear.toString()) &&
            cgpaRegex.test(String(edu.cgpa))
    )
}
const SKILLS = (skills: string[]) => {
    const skillRegex = /^[a-zA-Z0-9\s\-+./()]{2,50}$/
    return skills.length >= 1 && skills.every((skill) => skillRegex.test(skill))
}
const EXPERIENCE = (experience: { company: string; title: string; location: string; dates: string }[]) => {
    const companyRegex = /^[a-zA-Z0-9\s.,&-]{3,100}$/
    const titleRegex = /^[a-zA-Z0-9\s.,&-]{2,50}$/
    const locationRegex = /^(N\/A|n\/a|[a-zA-Z\s,/\-.]{2,100})$/
    const datesRegex = /^(N\/A|n\/a|[a-zA-Z0-9\s,/.\\-]{5,50})$/

    return experience.every(
        (exp) =>
            companyRegex.test(exp.company) &&
            titleRegex.test(exp.title) &&
            locationRegex.test(exp.location) &&
            datesRegex.test(exp.dates)
    )
}
const STATUS = /^(received|shortlisted)$/
const RESUME = /^(https?:\/\/[^\s$.?#].[^\s]*)$/
const OBJECT_ID = /^[a-f\d]{24}$/i

const INTERVIEWS = (interview: number) => interview >= 1
const PRICE = (price: string) => Number(price) > 0
const DURATION = (duration: string) => Number(duration) >= 1

export const Regex = {
    ROLE,
    NAME,
    PROFILE_PIC,
    WORK_TIME,
    WORK_MODE,
    JOB_LOCATION,
    MINIMUM_EXPERIENCE,
    SALARY,
    REQUIREMENTS,
    RESPONSIBILITIES,
    LAST_DATE,
    PHONE,
    EMAIL,
    SUMMARY,
    EDUCATION,
    SKILLS,
    EXPERIENCE,
    STATUS,
    RESUME,
    OBJECT_ID,
    INTERVIEWS,
    PRICE,
    DURATION,
}
