import { Document, Schema } from 'mongoose'

export interface IRecruiterSchema extends Document {
    companyName: string
    bio?: string
    basedAt?: string
    facebookProfile?: string
    linkedinProfile?: string
    twitterProfile?: string
    profilePicture?: string
    userId: Schema.Types.ObjectId
    createdAt?: Date
    updatedAt?: Date
}
