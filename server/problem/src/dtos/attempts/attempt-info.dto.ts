/* eslint-disable @typescript-eslint/no-explicit-any */
import { Language } from '@types'
import mongoose from 'mongoose'

export class AttemptInfo {
    _id: mongoose.Types.ObjectId
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

    constructor(attempt: any) {
        this._id = attempt._id
        this.status = attempt.status
        this.language = attempt.language
        this.solution = attempt.solution
        this.runTime = attempt.runTime
        this.memory = attempt.memory
        this.testCasePassed = attempt.testCasePassed
        this.createdAt = attempt.createdAt
        if (attempt.rejectionMessage) {
            this.rejectionMessage = attempt.rejectionMessage
        }
        if (attempt.rejectedTestCase) {
            this.rejectedTestCase = attempt.rejectedTestCase
        }
    }
}
