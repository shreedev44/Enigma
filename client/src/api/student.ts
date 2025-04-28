/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from "@/services/axios";
import { StudentSignupFormType } from "@/types/formTypes";
import { studentEndpoints } from "@/constants/endpointUrl";
import { Language } from "@/types/types";

const headers = {
	"x-user-level": "student",
};

export const signup = async (userData: StudentSignupFormType) => {
	try {
		const { data } = await Api.post(studentEndpoints.SIGNUP, userData, {
			headers,
		});
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const googleAuth = async (
	user: Omit<StudentSignupFormType, "password" | "confirmPassword"> & {
		profilePicture?: string;
	}
) => {
	try {
		const { data } = await Api.post(
			studentEndpoints.GOOGLE_AUTH,
			{
				user,
			},
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const githubAuth = async (code: string) => {
	try {
		const { data } = await Api.post(
			studentEndpoints.GITHUB_AUTH,
			{
				code,
			},
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getProfile = async () => {
	try {
		const { data } = await Api.get(studentEndpoints.FETCH_PROFILE, {
			headers,
		});
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const updateProfile = async (formData: FormData) => {
	try {
		const { data } = await Api.patch(
			studentEndpoints.UPDATE_PROFILE,
			formData,
			{
				headers: { ...headers, "Content-Type": "multipart/form-data" },
			}
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getProblems = async (query = "") => {
	try {
		const { data } = await Api.get(
			`${studentEndpoints.GET_PROBLEMS}?${query}`,
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const findProblem = async (problemNo: number) => {
	try {
		const { data } = await Api.get(
			`${studentEndpoints.FIND_PROBLEM}/${problemNo}`,
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const compileCode = async (code: string, language: Language) => {
	try {
		const { data } = await Api.post(
			studentEndpoints.COMPILE,
			{ code, language },
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const runSolution = async (
	code: string,
	language: Language,
	problemNo: number
) => {
	try {
		const { data } = await Api.post(
			studentEndpoints.RUN_SOLUTION,
			{ code, language, problemNo },
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const submitSolution = async (
	code: string,
	language: Language,
	problemNo: number
) => {
	try {
		const { data } = await Api.post(
			studentEndpoints.SUBMIT_SOLUTION,
			{ code, language, problemNo },
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getAttempts = async (problemNo: number) => {
	try {
		const { data } = await Api.get(
			`${studentEndpoints.GET_ATTEMPTS}/${problemNo}`,
			{
				headers,
			}
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const findAttempt = async (attemptId: string) => {
	try {
		const { data } = await Api.get(
			`${studentEndpoints.FIND_ATTEMPT}/${attemptId}`,
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getProblemStats = async () => {
	try {
		const { data } = await Api.get(studentEndpoints.PROBLEM_STATS, {
			headers,
		});
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getAttemptAttendance = async () => {
	try {
		const { data } = await Api.get(studentEndpoints.ATTEMPT_ATTENDANCE, {
			headers,
		});
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getJobs = async (query = "") => {
	try {
		const { data } = await Api.get(
			`${studentEndpoints.GET_JOBS}?${query}`,
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getRecruiter = async (userId: string) => {
	try {
		const { data } = await Api.get(
			`${studentEndpoints.GET_RECRUITER}/${userId}`,
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getJobDetails = async (jobId: string) => {
	try {
		const { data } = await Api.get(
			`${studentEndpoints.GET_JOBS}/${jobId}`,
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const applyForJob = async (jobId: string, formData: FormData) => {
	try {
		const { data } = await Api.post(
			`${studentEndpoints.APPLY_FOR_JOB}/${jobId}`,
			formData,
			{
				headers: { ...headers, "Content-Type": "multipart/form-data" },
			}
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const myApplications = async (query = "") => {
	try {
		const { data } = await Api.get(
			`${studentEndpoints.MY_APPLICATIONS}?${query}`,
			{
				headers,
			}
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const deleteApplication = async (applicationId: string) => {
	try {
		const { data } = await Api.delete(
			`${studentEndpoints.DELETE_APPLICATION}/${applicationId}`,
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const leaderboardRank = async (userId = "") => {
	try {
		const { data } = await Api.get(
			`${studentEndpoints.LEADERBOARD_RANK}/${userId}`,
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

// export const logout = async () => {
// 	try {
// 		const { data } = await Api.get(commonEndpoints.LOGOUT, {
// 			headers,
// 		});
// 		return { success: true, data };
// 	} catch (err) {
// 		const error = err as any;
// 		const message = error.response?.data?.error || "An error occured";
// 		return { success: false, error: message };
// 	}
// };
