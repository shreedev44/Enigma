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
    const { data } = await Api.get(studentEndpoints.FETCH_PROFILE, { headers });
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
