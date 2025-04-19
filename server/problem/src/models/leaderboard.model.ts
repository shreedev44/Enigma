import mongoose, { Schema, Document } from 'mongoose'
import { ILeaderboardSchema } from '@entities'
import { LeaderboardType } from '@types'

const LeaderboardSchema: Schema = new Schema<ILeaderboardSchema>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
        },
        solved: {
            beginner: {
                type: Number,
                required: true,
                default: 0,
            },
            intermediate: {
                type: Number,
                required: true,
                default: 0,
            },
            advanced: {
                type: Number,
                required: true,
                default: 0,
            },
        },
        rank: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
)

export interface LeaderboardDocument extends Document, LeaderboardType {}

export default mongoose.model<LeaderboardType>('Leaderboard', LeaderboardSchema, 'Leaderboard')
