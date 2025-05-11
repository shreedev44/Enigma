import mongoose, { Schema } from 'mongoose'
import { StudentProfileType } from '@types'

const UserSchema: Schema = new Schema<StudentProfileType>(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            default: '',
        },
        githubProfile: {
            type: String,
            default: '',
        },
        linkedinProfile: {
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
        skills: {
            type: [String],
            required: true,
            default: [],
        },
    },
    {
        timestamps: true,
    }
)

export interface StudentDocument extends Document, StudentProfileType {}

export default mongoose.model<StudentDocument>('StudentProfile', UserSchema, 'StudentProfiles')
