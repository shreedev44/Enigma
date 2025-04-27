export const studentRoutes = {
	SIGNIN: "/signin",
	SIGNUP: "/signup",
	VERIFY_OTP: "/verify-otp",
	HOME: "/home",
	GITHUB_AUTH: "/github-auth",
	GITHUB_AUTH_URL: `https://github.com/login/oauth/authorize?client_id=${
		import.meta.env.VITE_GITHUB_CLIENT_ID
	}&redirect_uri=${import.meta.env.VITE_ORIGIN + "/github-auth&scope=user"}`,
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",
	PROFILE: "/profile",
	PROBLEM_SET: "/problemset",
	PROBLEM: "/problem",
	COMPILER: "/online-compiler",
	JOBS: "/jobs",
	JOB_DETAILS: '/jobs/details'
};

export const recruiterRoutes = {
	SIGNIN: "/signin",
	SIGNUP: "/signup",
	VERIFY_OTP: "/verify-otp",
	HOME: "/home",
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",
	PROFILE: "/profile",
};

export const adminRoutes = {
	SIGNIN: "/signin",
	HOME: "/dashboard",
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",
	STUDENTS: "/users/students",
	RECRUITERS: "/users/recruiters",
	PROBLEMS: "/problems",
	ADD_PROBLEM: "/problems/add-problem",
};
