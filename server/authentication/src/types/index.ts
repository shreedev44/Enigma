import { Document, ObjectId } from 'mongoose'

export interface UserType extends Document {
    name: string
    email: string
    password?: string
    role: 'student' | 'recruiter' | 'admin'
    status?: 'active' | 'blocked'
    subscriptionType?: 'free' | 'premium'
    createdAt?: Date
    updatedAt?: Date
}

export type Role = 'student' | 'recruiter' | 'admin'

export interface StudentProfileType extends Document {
    firstName: string
    lastName?: string
    githubProfile?: string
    linkedinProfile?: string
    profilePicture?: string
    skills?: string[]
    userId: ObjectId
    createdAt?: Date
    updatedAt?: Date
}

export interface RecruiterProfileType extends Document {
    companyName: string
    bio?: string
    basedAt?: string
    facebookProfile?: string
    linkedinProfile?: string
    twitterProfile?: string
    profilePicture?: string
    userId: ObjectId
    createdAt?: Date
    updatedAt?: Date
}

export interface GoogleAuthUserType {
    email: string
    firstName?: string
    lastName?: string
    companyName?: string
    profilePicture: string
}

export interface LoginResponseType {
    accessToken: string
    refreshToken: string
    user: UserType
    profile?: StudentProfileType | RecruiterProfileType
}

export interface FileType {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    buffer: Buffer
    size: number
}

export interface StudentWithProfileType {
    _id: ObjectId
    email: string
    role: Role
    status: 'active' | 'blocked'
    createdAt: Date
    firstName: string
    lastName: string
    githubProfile: string
    linkedinProifle: string
    profilePicture: string
}

export interface RecruiterWithProfileType {
    _id: ObjectId
    email: string
    role: Role
    status: 'active' | 'blocked'
    subscriptionType: 'free' | 'premium'
    createdAt: Date
    companyName: string
    facebookProfile: string
    linkedinProifle: string
    twitterProifle: string
    profilePicture: string
    basedAt: string
    bio: string
}
