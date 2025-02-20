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
