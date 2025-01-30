interface StudentSignupFormType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: "student";
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
  role?: "recruiter";
}

type RecruiterSignupFormAction =
  | { type: "SET_COMPANY_NAME"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string };

interface LoginType {
  email: string;
  password: string;
}


interface StudentProfileType {
  _id: string;
  firstName: string;
  lastName: string;
  githubProfile: string;
  linkedinProfile: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecruiterProfileType {
  _id: string;
  companyName: string;
  bio: string;
  basedAt: string;
  facebookProfile: string;
  linkedinProfile: string;
  twitterProfile: string;
  profilePicture: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserStoreType {
  _id: string;
  email: string;
  role: "student" | "recruiter" | "admin" | "";
  status: "active" | "blocked" | "deleted" | "";
  accessToken: string | null;
  profilePicture?: string;
  name?: string;
}

interface ReduxStoreType {
  student: UserStoreType;
  recruiter: UserStoreType;
  admin: UserStoreType
}

type Role = "student" | "recruiter" | "admin"

export type {
  StudentSignupFormType,
  StudentSignupFormAction,
  RecruiterSignupFormType,
  RecruiterSignupFormAction,
  LoginType,
  UserStoreType,
  StudentProfileType,
  ReduxStoreType,
  Role
};
