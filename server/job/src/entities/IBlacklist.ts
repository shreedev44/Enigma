import { Document, Types } from 'mongoose'

export interface IBlacklistSchema extends Document {
    applicantId: Types.ObjectId
    recruiterId: Types.ObjectId
    applicantName: string
    createdAt: Date
    updatedAt: Date
}
