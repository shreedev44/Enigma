import { Document, Schema } from 'mongoose'

export interface IStudentSchema extends Document {
    firstName: string
    lastName?: string
    githubProfile?: string
    linkedinProfile?: string
    profilePicture?: string
    userId: Schema.Types.ObjectId
    createdAt?: Date
    updatedAt?: Date
}
