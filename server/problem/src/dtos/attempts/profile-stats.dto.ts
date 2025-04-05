/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProblemSolvedByDifficulty } from '@types'

export class ProfileStats {
    problemsSolvedByDifficulty: ProblemSolvedByDifficulty
    totalProblemsSolved: number
    totalProblemsExist: number
    acceptedAttempts: number
    notAcceptedAttempts: number

    constructor(stats: any) {
        this.problemsSolvedByDifficulty = stats.problemsSolvedByDifficulty
        this.totalProblemsSolved = stats.totalProblemsSolved
        this.totalProblemsExist = stats.totalProblemsExist
        this.acceptedAttempts = stats.acceptedAttempts
        this.notAcceptedAttempts = stats.notAcceptedAttempts
    }
}
