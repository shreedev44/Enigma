import { Language, ProblemListType, ProblemType } from '@types'

export interface IProblemService {
    addProblem(problem: ProblemType): Promise<void>
    getProblems(
        page: number,
        sortBy: string,
        sortOrder: 1 | -1,
        filter: string | null,
        userId: string | null
    ): Promise<{ problems: ProblemListType[]; totalPages: number }>
    findProblem(problemNo: number): Promise<ProblemType>
    compileCode(code: string, language: Language): Promise<{ stdout: string; stderr: string }>
    runSolution(code: string, language: Language, problemNo: number): Promise<{ stdout: string; stderr: string }>
}
