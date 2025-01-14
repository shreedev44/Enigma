import { ObjectId } from "mongoose";

export interface UserType {
    _id?: ObjectId;
    email: string;
    password?: string;
    role: 'student' | 'recruiter' | 'admin';
    status?: 'active' | 'blocked' | 'deleted';
    subscriptionType?: 'free' | 'premium';
    createdAt?: Date;
    updatedAt?: Date;
}

export type Role = 'student' | 'recruiter' | 'admin';

export interface StudentProfileType {
    _id?: ObjectId;
    firstName: string;
    lastName: string;
    githubProfile?: string;
    linkedinProfile?: string;
    profilePicture?: string;
    userId: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}