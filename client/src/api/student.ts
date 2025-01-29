/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from "@/services/axios";
import { StudentSignupFormType } from "@/types/formTypes";
import { studentEndpoints } from "@/constants/endpointUrl";

const headers = {
  "X-User-Level": "student",
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
    const { data } = await Api.post(studentEndpoints.UPDATE_PROFILE, formData, {
      headers: { ...headers, "Content-Type": "multipart/form-data" },
    });
    return { success: true, data };
  } catch (err) {
    const error = err as any;
    const message = error.response?.data?.error || "An error occured";
    return { success: false, error: message };
  }
};
