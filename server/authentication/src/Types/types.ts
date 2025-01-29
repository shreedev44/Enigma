import { ObjectId } from "mongoose";

export interface UserType {
  _id?: ObjectId;
  email: string;
  password?: string;
  role: "student" | "recruiter" | "admin";
  status?: "active" | "blocked" | "deleted";
  subscriptionType?: "free" | "premium";
  createdAt?: Date;
  updatedAt?: Date;
}

export type Role = "student" | "recruiter" | "admin";

export interface StudentProfileType {
  _id?: ObjectId;
  firstName: string;
  lastName?: string;
  githubProfile?: string;
  linkedinProfile?: string;
  profilePicture?: string;
  userId: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RecruiterProfileType {
  _id?: ObjectId;
  companyName: string;
  bio?: string;
  basedAt?: string;
  facebookProfile?: string;
  linkedinProfile?: string;
  twitterProfile?: string;
  profilePicture?: string;
  userId: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GoogleAuthUserType {
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  profilePicture: string;
}

export interface LoginResponseType {
  accessToken: string;
  refreshToken: string;
  user: UserType;
  profile?: StudentProfileType | RecruiterProfileType;
}

export interface FileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
