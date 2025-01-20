/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from "@/services/axios";
import { RecruiterSignupFormType } from "@/types/formTypes";
import { recruiterEndpoints } from "@/constants/endpointUrl";


export const signup = async (userData: RecruiterSignupFormType) => {
    try {
        const { data } = await Api.post(recruiterEndpoints.SIGNUP, userData)
        return {success: true, data}
    } catch (err) {
        const error = err as any;
        const message = error.response?.data?.error || "An error occured"
        return {success: false, error: message}
    }
}


export const verifyOtp = async (otp: string, email: string) => {
    try{
        const { data } = await Api.post(recruiterEndpoints.VERIFY_OTP, {otp, email})
        return {success: true, data}
    } catch (err) {
        const error = err as any;
        const message = error.response?.data?.error || "An error occured"
        return {success: false, error: message}
    }
}


export const resendOtp = async (email: string) => {
  try {
    const { data } = await Api.post(recruiterEndpoints.RESEND_OTP, {
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
        const { data } = await Api.post(recruiterEndpoints.SIGNIN, {email, password})
        return {success: true, data}
    } catch (err) {
        const error = err as any;
        const message = error.response?.data?.error || "An error occured"
        return {success: false, error: message}
    }
}


export const googleAuth = async (
    user: Omit<RecruiterSignupFormType, "password" | "confirmPassword"> & {
      profilePicture?: string;
    }
  ) => {
    try {
      const { data } = await Api.post(recruiterEndpoints.GOOGLE_AUTH, {
        user,
      });
      return { success: true, data };
    } catch (err) {
      const error = err as any;
      const message = error.response?.data?.error || "An error occured";
      return { success: false, error: message };
    }
  };