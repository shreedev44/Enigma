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
    findProblemByNo(problemNo: number): Promise<ProblemType | null>
}
