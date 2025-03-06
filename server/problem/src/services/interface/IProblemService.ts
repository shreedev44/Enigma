import { Language, ProblemListType, ProblemType } from "../../Types/types";

export interface IProblemService {
    addProblem(problem: ProblemType): Promise<void>;
    getProblems(page: number, sortBy: string, sortOrder: 1 | -1, filter: string | null): Promise<{problems: ProblemListType[], totalPages: number}>;
    findProblem(problemNo: number): Promise<ProblemType>;
    compileCode(code: string, language: Language): Promise<{stdout: string, stderr: string}>;
}