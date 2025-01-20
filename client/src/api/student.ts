/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from "@/services/axios";
import { StudentSignupFormType } from "@/types/formTypes";
import { studentEndpoints } from "@/constants/endpointUrl";

export const signup = async (userData: StudentSignupFormType) => {
  try {
    const { data } = await Api.post(studentEndpoints.SIGNUP, userData);
    return { success: true, data };
  } catch (err) {
    const error = err as any;
    const message = error.response?.data?.error || "An error occured";
    return { success: false, error: message };
  }
};

export const verifyOtp = async (otp: string, email: string) => {
  try {
    const { data } = await Api.post(studentEndpoints.VERIFY_OTP, {
      otp,
      email,
    });
    return { success: true, data };
  } catch (err) {
    const error = err as any;
    const message = error.response?.data?.error || "An error occured";
    return { success: false, error: message };
  }
};

export const resendOtp = async (email: string) => {
  try {
    const { data } = await Api.post(studentEndpoints.RESEND_OTP, {
      email,
    });
    return { success: true, data };
  } catch (err) {
    const error = err as any;
    const message = error.response?.data?.error || "An error occured";
    return { success: false, error: message };
  }
};

export const signin = async (email: string, password: string) => {
  try {
    const { data } = await Api.post(studentEndpoints.SIGNIN, {
      email,
      password,
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
    const { data } = await Api.post(studentEndpoints.GOOGLE_AUTH, {
      user,
    });
    return { success: true, data };
  } catch (err) {
    const error = err as any;
    const message = error.response?.data?.error || "An error occured";
    return { success: false, error: message };
  }
};

export const githubAuth = async (code: string) => {
  try {
    const { data } = await Api.post(studentEndpoints.GITHUB_AUTH, {
      code,
    });
    return { success: true, data };
  } catch (err) {
    const error = err as any;
    const message = error.response?.data?.error || "An error occured";
    return { success: false, error: message };
  }
};
