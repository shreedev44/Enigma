import mongoose, { Document, Schema } from 'mongoose'
import { RecruiterProfileType } from '@types'
import { IRecruiterSchema } from '@entities'

const RecruiterSchema = new Schema<IRecruiterSchema>(
    {
        companyName: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            default: '',
        },
        basedAt: {
            type: String,
            default: '',
        },
        facebookProfile: {
            type: String,
            default: '',
        },
        linkedinProfile: {
            type: String,
            default: '',
        },
        twitterProfile: {
            type: String,
            default: '',
        },
        profilePicture: {
            type: String,
            default: '',
        },
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export interface RecruiterDocument extends Document, RecruiterProfileType {}

export default mongoose.model<RecruiterProfileType>('RecruiterProfile', RecruiterSchema, 'RecruiterProfiles')
