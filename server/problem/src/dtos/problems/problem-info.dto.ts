/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, DifficultyType, ProblemParameter, TestCaseType } from '@types'
import mongoose from 'mongoose'

export class ProblemInfo {
    _id: mongoose.Types.ObjectId
    problemNo: number
    title: string
    difficulty: DifficultyType
    description: string
    functionName: string
    parameters: ProblemParameter[]
    functionReturnType: DataTypes
    functionReturnElemType?: DataTypes
    functionReturnNestedType?: Exclude<DataTypes, 'Array'>
    evalFunction: string
    testCases: TestCaseType[]
    status: string
    createdAt: Date
    constraints: string[]

    constructor(problem: any) {
        this._id = problem._id
        this.problemNo = problem.problemNo
        this.title = problem.title
        this.difficulty = problem.difficulty
        this.description = problem.description
        this.functionName = problem.functionName
        this.parameters = problem.parameters
        this.functionReturnType = problem.functionReturnType
        this.evalFunction = problem.evalFunction
        this.testCases = problem.testCases
        this.createdAt = problem.createdAt
        this.constraints = problem.constraints
        this.status = problem.status
        if (problem.functionReturnElemType) {
            this.functionReturnElemType = problem.functionReturnElemType
        }
        if (problem.functionReturnNestedType) {
            this.functionReturnNestedType = problem.functionReturnNestedType
        }
    }
}
