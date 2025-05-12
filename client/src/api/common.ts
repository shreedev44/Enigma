/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from "@/services/axios";
import { commonEndpoints } from "@/constants/endpointUrl";
import { Role } from "@/types/formTypes";

function getHeader(role: Role) {
	return {
		"x-user-level": role,
	};
}

export const verifyOtp = async (otp: string, email: string, role: Role) => {
	try {
		const { data } = await Api.post(
			commonEndpoints.VERIFY_OTP,
			{
				otp,
				email,
			},
			{ headers: getHeader(role) }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const resendOtp = async (email: string, role: Role) => {
	try {
		const { data } = await Api.post(
			commonEndpoints.RESEND_OTP,
			{
				email,
			},
			{ headers: getHeader(role) }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const signin = async (email: string, password: string, role: Role) => {
	try {
		const { data } = await Api.post(
			commonEndpoints.SIGNIN,
			{
				email,
				password,
				role,
			},
			{ headers: getHeader(role) }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const forgotPassword = async (email: string, role: Role) => {
	try {
		const { data } = await Api.post(
			commonEndpoints.FORGOT_PASSWORD,
			{
				email,
			},
			{ headers: getHeader(role) }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const resetPassword = async (
	token: string,
	password: string,
	role: Role
) => {
	try {
		const { data } = await Api.patch(
			commonEndpoints.RESET_PASSWORD,
			{
				token,
				password,
			},
			{ headers: getHeader(role) }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getJobDetails = async (jobId: string, role: Role) => {
	try {
		const { data } = await Api.get(
			`${commonEndpoints.JOB_DETAILS}/${jobId}`,
			{ headers: getHeader(role) }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const hideJob = async (jobId: string, role: Role) => {
	try {
		const { data } = await Api.patch(
			`${commonEndpoints.HIDE_JOB}/${jobId}`,
			{},
			{ headers: getHeader(role) }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const fetchSkills = async (keyword: string) => {
	const url = `https://ec.europa.eu/esco/api/search?text=${encodeURIComponent(
		keyword
	)}&type=skill&limit=5`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`ESCO API error: ${response.status}`);
		}

		const data = await response.json();

		const skillNames = data._embedded.results.map(
			(result: { title: string }) => result.title
		);

		return skillNames;
	} catch (error) {
		console.error("Failed to fetch skills:", error);
		return [];
	}
};

export const getProfile = async (role: Role, userId: string) => {
	try {
		const { data } = await Api.get(
			`${commonEndpoints.FETCH_STUDENT_PROFILE}/${userId}`,
			{
				headers: getHeader(role),
			}
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getAttemptAttendance = async (role: Role, userId: string) => {
	try {
		const { data } = await Api.get(
			`${commonEndpoints.ATTEMPT_ATTENDANCE}/${userId}`,
			{
				headers: getHeader(role),
			}
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getProblemStats = async (role: Role, userId: string) => {
	try {
		const { data } = await Api.get(
			`${commonEndpoints.PROBLEM_STATS}/${userId}`,
			{
				headers: getHeader(role),
			}
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const leaderboardRank = async (role: Role, userId: string) => {
	try {
		const { data } = await Api.get(
			`${commonEndpoints.LEADERBOARD_RANK}/${userId}`,
			{ headers: getHeader(role) }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};
