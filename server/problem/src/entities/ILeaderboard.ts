import { Document, Schema } from 'mongoose'

export interface ILeaderboardSchema extends Document {
    _id: Schema.Types.ObjectId
    userId: Schema.Types.ObjectId
    username: string
    profilePicture: string
    solved: {
        beginner: number
        intermediate: number
        advanced: number
    }
    rank: number
    createdAt: Date
    updatedAt: Date
}
