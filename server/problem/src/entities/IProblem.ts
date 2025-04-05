import { DataTypes, DifficultyType, ProblemParameter, TestCaseType } from '@types'
import { Document, Schema } from 'mongoose'

export interface IProblemSchema extends Document {
    _id: Schema.Types.ObjectId
    problemNo?: number
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
    status?: 'listed' | 'unlisted'
    createdAt?: Date
    updatedAt?: Date
    constraints?: string[]
}
