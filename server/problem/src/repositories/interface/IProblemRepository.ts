import { ProblemListType, ProblemType } from '@types'

export interface IProblemRepository {
    create(problem: ProblemType): Promise<ProblemType>
    findByTitle(title: string): Promise<ProblemType | null>
    findLatestProblem(): Promise<ProblemType | null>
    getProblems(sort: Record<string, 1 | -1>, filter: Record<string, string>): Promise<ProblemListType[]>
    findProblemByNo(problemNo: number): Promise<ProblemType | null>
}
