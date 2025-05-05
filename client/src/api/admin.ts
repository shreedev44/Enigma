/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from "@/services/axios";
import { adminEndpoints } from "@/constants/endpointUrl";
import { ProblemType } from "@/types/types";

const headers = {
	"x-user-level": "admin",
};

export const getStudents = async (query = "") => {
	try {
		const { data } = await Api.get(
			`${adminEndpoints.FETCH_STUDENTS}?${query}`,
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getRecruiters = async (query = "") => {
	try {
		const { data } = await Api.get(
			`${adminEndpoints.FETCH_RECRUITERS}?${query}`,
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const blockAction = async (userId: string, block: boolean) => {
	try {
		const { data } = await Api.patch(
			adminEndpoints.BLOCK_ACTION,
			{
				userId,
				block,
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

export const addProblem = async (problem: ProblemType) => {
	try {
		const { data } = await Api.post(adminEndpoints.ADD_PROBLEM, problem, {
			headers,
		});
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
			`${adminEndpoints.FIND_PROBLEM}/${problemNo}`,
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const updateProblem = async (
	problemId: string,
	problem: Record<string, unknown>
) => {
	try {
		const { data } = await Api.patch(
			`${adminEndpoints.UPDATE_PROBLEM}/${problemId}`,
			problem,
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const unlistProblem = async (problemId: string) => {
	try {
		const { data } = await Api.patch(
			`${adminEndpoints.UNLIST_PROBLEM}/${problemId}`,
			{},
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const listProblem = async (problemId: string) => {
	try {
		const { data } = await Api.patch(
			`${adminEndpoints.LIST_PROBLEM}/${problemId}`,
			{},
			{ headers }
		);
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getAllJobs = async (query = "") => {
	try {
		const { data } = await Api.get(`${adminEndpoints.GET_JOBS}?${query}`, {
			headers,
		});
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
};

export const getUserStats = async () => {
	try {
		const { data } = await Api.get(adminEndpoints.USER_STATS, {
			headers,
		});
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
}

export const getJobStats = async () => {
	try {
		const { data } = await Api.get(adminEndpoints.JOB_STATS, {
			headers,
		});
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
}

export const getProblemStats = async () => {
	try {
		const { data } = await Api.get(adminEndpoints.PROBLEM_STATS, {
			headers,
		});
		return { success: true, data };
	} catch (err) {
		const error = err as any;
		const message = error.response?.data?.error || "An error occured";
		return { success: false, error: message };
	}
}

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
