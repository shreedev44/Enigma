import Problem from '@models/problem.model'
import { ProblemListType, ProblemType } from '@types'
import { IProblemRepository } from '@repositories/interface'

class ProblemRepository implements IProblemRepository {
    async create(problem: ProblemType): Promise<ProblemType> {
        try {
            const problemData = await Problem.create(problem)
            return problemData
        } catch (err) {
            console.log(err)
            throw new Error('Error creating problem')
        }
    }

    async findByTitle(title: string): Promise<ProblemType | null> {
        try {
            const problem = await Problem.findOne({ title })
            return problem
        } catch (err) {
            console.log(err)
            throw new Error('Error checking whether problem exists')
        }
    }

    async findLatestProblem(): Promise<ProblemType | null> {
        try {
            const latest = await Problem.findOne().sort({ createdAt: -1 })
            return latest
        } catch (err) {
            console.log(err)
            throw new Error('Error finding latest problem')
        }
    }

    async getProblems(sort: Record<string, 1 | -1>, filter: Record<string, string>): Promise<ProblemListType[]> {
        try {
            const problems = await Problem.aggregate([
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        difficulty: 1,
                        problemNo: 1,
                        status: 1,
                    },
                },
                { $match: filter },
                { $sort: sort },
            ])
            return problems
        } catch (err) {
            console.log(err)
            throw new Error('Error finding problems')
        }
    }

    async findProblemByNo(problemNo: number): Promise<ProblemType | null> {
        try {
            const problem = await Problem.findOne({ problemNo }, { testCases: { $slice: 3 } })
            return problem
        } catch (err) {
            console.log(err)
            throw new Error('Error finding problem')
        }
    }
}

export default new ProblemRepository()
