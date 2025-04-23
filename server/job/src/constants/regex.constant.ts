const ROLE = /^[a-zA-Z ]{3,50}$/
const WORK_TIME = /^(Full-Time|Part-Time)$/
const WORK_MODE = /^(On-Site|Remote|Hybrid)$/
const JOB_LOCATION = /^[a-zA-Z, ]{3,50}$/
const MINIMUM_EXPERIENCE = /^[0-9]{1,2}$/
const SALARY = /^[0-9]{1,2}$/
const REQUIREMENTS = /^(?:[\s\S]{10,500}\n?){3,}$/
const RESPONSIBILITIES = (responsibilities: string[]) => {
    const regex = /^[\s\S]{10,500}$/
    return (
        responsibilities.length >= 3 &&
        responsibilities.length <= 500 &&
        responsibilities.every((responsibility) => regex.test(responsibility))
    )
}
const LAST_DATE = /^\d{4}-\d{2}-\d{2}$/

export const Regex = {
    ROLE,
    WORK_TIME,
    WORK_MODE,
    JOB_LOCATION,
    MINIMUM_EXPERIENCE,
    SALARY,
    REQUIREMENTS,
    RESPONSIBILITIES,
    LAST_DATE,
}
