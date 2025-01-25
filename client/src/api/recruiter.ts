/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from "@/services/axios";
import { RecruiterSignupFormType } from "@/types/formTypes";
import { recruiterEndpoints } from "@/constants/endpointUrl";

const headers = {
  "X-User-Level": "recruiter",
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
