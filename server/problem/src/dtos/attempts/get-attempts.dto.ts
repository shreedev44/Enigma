/* eslint-disable @typescript-eslint/no-explicit-any */
import { Language } from '@types'
import mongoose from 'mongoose'

export class GetAttempts {
    _id: mongoose.Types.ObjectId
    createdAt: Date
    language: Language
    status: 'Accepted' | 'Rejected' | 'Compile Error'
    solution: string
    constructor(attempt: any) {
        this._id = attempt._id
        this.createdAt = attempt.createdAt
        this.language = attempt.language
        this.status = attempt.status
        this.solution = attempt.solution
    }
}
