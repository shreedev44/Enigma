export const studentEndpoints = {
    SIGNUP: '/auth/student/register',
    GOOGLE_AUTH: '/auth/googleAuth',
    GITHUB_AUTH: '/auth/githubAuth',
    FETCH_PROFILE: '/auth/student/getProfile',
    UPDATE_PROFILE: '/auth/student/updateProfile'
}

export const recruiterEndpoints = {
    SIGNUP: '/auth/recruiter/register',
    GOOGLE_AUTH: '/auth/googleAuth',
    FETCH_PROFILE: "/auth/recruiter/getProfile",
    UPDATE_PROFILE: "/auth/recruiter/updateProfile"
}

export const adminEndpoints = {
    
}

export const commonEndpoints = {
    VERIFY_OTP: '/auth/verifyOtp',
    RESEND_OTP: '/auth/resendOtp',
    SIGNIN: '/auth/signin',
    FORGOT_PASSWORD: '/auth/changePassword',
    RESET_PASSWORD: '/auth/resetPassword',
    REFRESH_TOKEN: `${import.meta.env.VITE_BASE_URL}/auth/refreshToken`,
}