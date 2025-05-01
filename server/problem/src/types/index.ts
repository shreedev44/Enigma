import mongoose, { Document } from 'mongoose'

export type DataTypes = 'Array' | 'Floating Point' | 'String' | 'Integer' | 'Boolean'

export type DifficultyType = 'Beginner' | 'Intermediate' | 'Advanced'

export type TestCaseType = {
    input: { parameter: string; value: unknown }[]
    output: unknown
}

export type ProblemParameter = {
    name: string
    type: DataTypes
    paramMinValue: number
    paramMaxValue: number
    elemType?: DataTypes
    elemMinValue?: number
    elemMaxValue?: number
    nestedType?: Exclude<DataTypes, 'Array'>
    nestedMinValue?: number
    nestedMaxValue?: number
}

export interface ProblemType extends Document {
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

export type ProblemListType = {
    _id: mongoose.Types.ObjectId
    title: string
    difficulty: DifficultyType
    problemNo?: number
    successRate?: number
    solved?: 'solved' | 'unsolved'
    status?: 'listed' | 'unlisted'
    createdAt?: Date
}

export type Language = 'javascript' | 'python' | 'java' | 'golang' | 'cpp'

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] }

export interface AttemptType extends Document {
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

export type ProblemSolvedByDifficulty = {
    beginner: number
    intermediate: number
    advanced: number
}

export type AggregationResult = {
    problemsSolvedByDifficulty: { _id: string; count: number }[]
    totalProblemsSolved: { totalSolved: number }[]
    totalProblemsExist: { totalExist: number }[]
    attemptStats: { _id: string; count: number }[]
}

export type ProfileStatType = {
    problemsSolvedByDifficulty: ProblemSolvedByDifficulty
    totalProblemsSolved: number
    totalProblemsExist: number
    acceptedAttempts: number
    notAcceptedAttempts: number
}

export type AttemptsPerDay = {
    date: string
    count: number
}

export interface LeaderboardType extends Document {
    userId: string
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
