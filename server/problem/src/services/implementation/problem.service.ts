import { createHttpError } from '@utils'
import { _HttpStatus, Messages } from '@constants'
import { IProblemService } from '@services/interface'
import { IProblemRepository } from '@repositories/interface'
import { Language, MakeOptional, ProblemListType, ProblemType } from '@types'
import { executeCode } from '@utils'
import { generateConstraints } from '@utils'
import { getPrompt } from '@utils'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { basePrompt } from '@constants'
import { env } from '@configs'
import { testFunctions } from '@constants'
import { ProblemDTO } from '@dtos'

export class ProblemService implements IProblemService {
    constructor(private _problemRepository: IProblemRepository) {}

    async addProblem(problem: MakeOptional<ProblemType, 'testCases'>): Promise<void> {
        const problemExist = await this._problemRepository.findByTitle(problem.title)

        if (problemExist) {
            throw createHttpError(_HttpStatus.CONFLICT, Messages.PROBLEM_TITLE_EXIST)
        }

        const prompt = getPrompt(
            problem.description,
            {
                functionReturnType: problem.functionReturnType,
                functionReturnElemType: problem.functionReturnElemType,
                functionReturnNestedType: problem.functionReturnNestedType,
            },
            problem.parameters
        )
        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-pro-exp-02-05',
        })

        const result = await model.generateContent(basePrompt + '\n\n\n' + prompt)

        const testCases = JSON.parse(result.response.text().replace(/```json\n|\n```/g, ''))

        problem.testCases = testCases
        problem.constraints = problem.parameters.map((parameter) => generateConstraints(parameter)).flat()
        const latest = await this._problemRepository.findLatestProblem()
        problem.problemNo = (latest?.problemNo || 0) + 1

        await this._problemRepository.create(problem as ProblemType)
    }

    async getProblems(
        page: number,
        sortBy: string,
        sortOrder: 1 | -1,
        filter: string | null,
        userId: string | null,
        role: string
    ): Promise<InstanceType<typeof ProblemDTO.GetProblems>> {
        const sort = { [sortBy]: sortOrder }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let query: any = {}
        if (role === 'student') {
            query.status = 'listed'
        }
        if (filter) {
            query = {
                $and: [
                    {
                        $or: [
                            { title: { $regex: filter, $options: 'i' } },
                            { problemNo: { $regex: filter, $options: 'i' } },
                            { difficulty: { $regex: filter, $options: 'i' } },
                        ],
                    },
                    ...(role === 'student' ? [{ status: 'listed' }] : []),
                ],
            }
        }

        let problems: ProblemListType[]
        if (userId) {
            problems = await this._problemRepository.getProblemsWithStatus(sort, query, userId)
        } else {
            problems = await this._problemRepository.getProblems(sort, query)
        }

        const dataPerPage = 1
        const totalPages = Math.ceil(problems.length / dataPerPage)

        const startIndex = (page - 1) * dataPerPage
        const endIndex = startIndex + dataPerPage
        return new ProblemDTO.GetProblems({ problems: problems.slice(startIndex, endIndex), totalPages })
    }

    async findProblem(problemNo: number, role: string): Promise<InstanceType<typeof ProblemDTO.ProblemInfo>> {
        const problem = await this._problemRepository.findProblemByNo(problemNo, role)

        if (!problem) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.PROBLEM_NOT_FOUND)
        }
        problem.testCases = problem.testCases.slice(0, 3)
        return new ProblemDTO.ProblemInfo(problem)
    }

    async compileCode(code: string, language: Language): Promise<InstanceType<typeof ProblemDTO.Compile>> {
        const result = await executeCode(language, code)

        return new ProblemDTO.Compile(result)
    }

    async runSolution(
        code: string,
        language: Language,
        problemNo: number
    ): Promise<InstanceType<typeof ProblemDTO.Compile>> {
        const problem = await this._problemRepository.findProblemByNo(problemNo, 'student')
        if (!problem) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.PROBLEM_NOT_FOUND)
        }
        const result = await executeCode(
            language,
            testFunctions[language as Exclude<Language, 'cpp'>](
                problem?.testCases?.slice(0, 3),
                code,
                problem?.functionName
            )
        )
        try {
            JSON.parse(result.stdout)
        } catch (_err) {
            result.stderr = result.stdout
            result.stdout = ''
        }
        return new ProblemDTO.Compile(result)
    }

    async updateProblem(problemId: string, problem: Partial<ProblemType>): Promise<void> {
        const updatedProblem = await this._problemRepository.updateProblemById(problemId, problem)

        if (!updatedProblem) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.PROBLEM_NOT_FOUND)
        }
    }

    async listProblem(problemId: string): Promise<void> {
        const problem = await this._problemRepository.listProblemById(problemId)

        if (!problem) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.PROBLEM_NOT_FOUND)
        }
    }

    async unlistProblem(problemId: string): Promise<void> {
        const problem = await this._problemRepository.unlistProblemById(problemId)

        if (!problem) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.PROBLEM_NOT_FOUND)
        }
    }
}
