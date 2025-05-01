import { ProblemDTO } from '@dtos'
import { Language, ProblemType } from '@types'

export interface IProblemService {
    addProblem(problem: ProblemType): Promise<void>
    getProblems(
        page: number,
        sortBy: string,
        sortOrder: 1 | -1,
        filter: string | null,
        userId: string | null,
        role: string
    ): Promise<InstanceType<typeof ProblemDTO.GetProblems>>
    findProblem(problemNo: number, role: string): Promise<InstanceType<typeof ProblemDTO.ProblemInfo>>
    compileCode(code: string, language: Language): Promise<InstanceType<typeof ProblemDTO.Compile>>
    runSolution(code: string, language: Language, problemNo: number): Promise<InstanceType<typeof ProblemDTO.Compile>>
    updateProblem(problemId: string, problem: Partial<ProblemType>): Promise<void>
    unlistProblem(problemId: string): Promise<void>
    listProblem(problemId: string): Promise<void>
}
