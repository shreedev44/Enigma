/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProblemListType } from '@types'

export class GetProblems {
    problems: ProblemListType[]
    totalPages: number

    constructor(returnObject: any) {
        this.totalPages = returnObject.totalPages
        this.problems = returnObject.problems.map((problem: ProblemListType) => {
            const obj: ProblemListType = {
                _id: problem._id,
                title: problem.title,
                difficulty: problem.difficulty,
            }
            if (problem.problemNo) obj.problemNo = problem.problemNo
            if (problem.successRate) obj.successRate = problem.successRate
            if (problem.solved) obj.solved = problem.solved
            return obj
        })
    }
}
