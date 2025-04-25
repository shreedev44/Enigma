const ROLE = /^[a-zA-Z ]{3,50}$/
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
}
