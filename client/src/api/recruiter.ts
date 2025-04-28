/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from "@/services/axios";
import { RecruiterSignupFormType } from "@/types/formTypes";
import { recruiterEndpoints } from "@/constants/endpointUrl";

const headers = {
	"x-user-level": "recruiter",
};

export const signup = async (userData: RecruiterSignupFormType) => {
	try {
		const { data } = await Api.post(recruiterEndpoints.SIGNUP, userData, {
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
	user: Omit<RecruiterSignupFormType, "password" | "confirmPassword"> & {
		profilePicture?: string;
	}
) => {
	try {
		const { data } = await Api.post(
			recruiterEndpoints.GOOGLE_AUTH,
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

export const getProfile = async () => {
	try {
		const { data } = await Api.get(recruiterEndpoints.FETCH_PROFILE, {
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
			recruiterEndpoints.UPDATE_PROFILE,
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

export const postJob = async (form: Record<string, unknown>) => {
	try {
		const { data } = await Api.post(recruiterEndpoints.POST_JOB, form, {
			headers,
		});
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getMyJobs = async (query = "") => {
	try {
		const { data } = await Api.get(
			`${recruiterEndpoints.MY_JOBS}?${query}`,
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
