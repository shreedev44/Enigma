interface StudentSignupFormType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type StudentSignupFormAction =
  | { type: "SET_FIRST_NAME"; payload: string }
  | { type: "SET_LAST_NAME"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string };

interface RecruiterSignupFormType {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type RecruiterSignupFormAction =
  | { type: "SET_COMPANY_NAME"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string };

export type { StudentSignupFormType, StudentSignupFormAction, RecruiterSignupFormType, RecruiterSignupFormAction };
