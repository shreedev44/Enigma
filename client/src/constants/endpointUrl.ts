export const studentEndpoints = {
	SIGNUP: "/auth/student/register",
	GOOGLE_AUTH: "/auth/googleAuth",
	GITHUB_AUTH: "/auth/githubAuth",
	FETCH_PROFILE: "/auth/student/getProfile",
	UPDATE_PROFILE: "/auth/student/updateProfile",
	GET_PROBLEMS: "/problem/getProblems",
	FIND_PROBLEM: "/problem/findProblem",
	COMPILE: "/problem/compile",
	RUN_SOLUTION: "/problem/run-solution",
	SUBMIT_SOLUTION: "/problem/attempt/submit-solution",
	GET_ATTEMPTS: "/problem/attempt/get-attempts",
	FIND_ATTEMPT: "/problem/attempt/find-attempt",
	PROBLEM_STATS: "/problem/attempt/problem-stats",
	ATTEMPT_ATTENDANCE: "/problem/attempt/attempts-per-day"
};

export const recruiterEndpoints = {
	SIGNUP: "/auth/recruiter/register",
	GOOGLE_AUTH: "/auth/googleAuth",
	FETCH_PROFILE: "/auth/recruiter/getProfile",
	UPDATE_PROFILE: "/auth/recruiter/updateProfile",
};

export const adminEndpoints = {
	FETCH_STUDENTS: "/auth/admin/getStudents",
	FETCH_RECRUITERS: "/auth/admin/getRecruiters",
	BLOCK_ACTION: "/auth/admin/blockOrUnblock",
	ADD_PROBLEM: "/problem/addProblem",
};

export const commonEndpoints = {
	VERIFY_OTP: "/auth/verifyOtp",
	RESEND_OTP: "/auth/resendOtp",
	SIGNIN: "/auth/signin",
	FORGOT_PASSWORD: "/auth/changePassword",
	RESET_PASSWORD: "/auth/resetPassword",
	REFRESH_TOKEN: `${import.meta.env.VITE_BASE_URL}/auth/refreshToken`,
};
