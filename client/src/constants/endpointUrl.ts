export const studentEndpoints = {
	SIGNUP: "/auth/student/register",
	GOOGLE_AUTH: "/auth/google-auth",
	GITHUB_AUTH: "/auth/github-auth",
	FETCH_PROFILE: "/auth/student/get-profile",
	UPDATE_PROFILE: "/auth/student/update-profile",
	GET_PROBLEMS: "/problem/get-problems",
	FIND_PROBLEM: "/problem/find-problem",
	COMPILE: "/problem/compile",
	RUN_SOLUTION: "/problem/run-solution",
	SUBMIT_SOLUTION: "/problem/attempt/submit-solution",
	GET_ATTEMPTS: "/problem/attempt/get-attempts",
	FIND_ATTEMPT: "/problem/attempt/find-attempt",
	PROBLEM_STATS: "/problem/attempt/problem-stats",
	ATTEMPT_ATTENDANCE: "/problem/attempt/attempts-per-day",
	GET_JOBS: "/job",
	GET_RECRUITER: "/auth/get-recruiter",
	APPLY_FOR_JOB: "/job/application/apply",
};

export const recruiterEndpoints = {
	SIGNUP: "/auth/recruiter/register",
	GOOGLE_AUTH: "/auth/google-auth",
	FETCH_PROFILE: "/auth/recruiter/get-profile",
	UPDATE_PROFILE: "/auth/recruiter/update-profile",
};

export const adminEndpoints = {
	FETCH_STUDENTS: "/auth/admin/get-students",
	FETCH_RECRUITERS: "/auth/admin/get-recruiters",
	BLOCK_ACTION: "/auth/admin/block-or-unblock",
	ADD_PROBLEM: "/problem/add-problem",
};

export const commonEndpoints = {
	VERIFY_OTP: "/auth/verify-otp",
	RESEND_OTP: "/auth/resend-otp",
	SIGNIN: "/auth/signin",
	FORGOT_PASSWORD: "/auth/change-password",
	RESET_PASSWORD: "/auth/reset-password",
	REFRESH_TOKEN: `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
};
