import { Document, Types } from 'mongoose'

export interface IInterviewSchema extends Document {
    userId: Types.ObjectId
    meetingId: string
    candidateEmail?: string
    meetingTime: Date
    createdAt: Date
    updatedAt: Date
}
