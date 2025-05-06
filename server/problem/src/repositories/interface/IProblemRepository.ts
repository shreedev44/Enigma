import { ProblemDocument } from '@models/problem.model'
import { IBaseRepository } from '@shreedev44/enigma-shared'
import { ProblemListType, ProblemType } from '@types'

export interface IProblemRepository extends IBaseRepository<ProblemType> {
    create(problem: Partial<ProblemType>): Promise<ProblemDocument>
    findByTitle(title: string): Promise<ProblemType | null>
    findLatestProblem(): Promise<ProblemType | null>
    getProblems(sort: Record<string, 1 | -1>, filter: Record<string, string>): Promise<ProblemListType[]>
    getProblemsWithStatus(
        sort: Record<string, 1 | -1>,
        filter: Record<string, string>,
        userId: string
    ): Promise<ProblemListType[]>
    findProblemByNo(problemNo: number, role: string): Promise<ProblemType | null>
    updateProblemById(problemId: string, problem: Partial<ProblemType>): Promise<ProblemDocument | null>
    unlistProblemById(problemId: string): Promise<ProblemDocument | null>
    listProblemById(problemId: string): Promise<ProblemDocument | null>
    countDocuments(): Promise<number>
}
