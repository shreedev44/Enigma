import { ProblemDTO } from '@dtos'
import { Language, ProblemType } from '@types'

export interface IProblemService {
    addProblem(problem: ProblemType): Promise<void>
    getProblems(
        page: number,
        sortBy: string,
        sortOrder: 1 | -1,
        filter: string | null,
        userId: string | null
    ): Promise<InstanceType<typeof ProblemDTO.GetProblems>>
    findProblem(problemNo: number): Promise<InstanceType<typeof ProblemDTO.ProblemInfo>>
    compileCode(code: string, language: Language): Promise<InstanceType<typeof ProblemDTO.Compile>>
    runSolution(code: string, language: Language, problemNo: number): Promise<InstanceType<typeof ProblemDTO.Compile>>
}
