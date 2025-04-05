import { Language } from '@types'
import { Document, Schema } from 'mongoose'

export interface IAttemptSchema extends Document {
    _id: Schema.Types.ObjectId
    userId: string
    problemNo: number
    status: 'Accepted' | 'Rejected' | 'Compile Error'
    language: Language
    solution: string
    runTime: string
    memory: string
    testCasePassed: number
    rejectionMessage?: string
    rejectedTestCase?: {
        expected: string
        output: string
    }
    createdAt: Date
    updatedAt: Date
}
