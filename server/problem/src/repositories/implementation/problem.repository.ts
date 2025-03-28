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
                { $match: filter },
                {
                    $lookup: {
                        from: 'Attempts',
                        localField: 'problemNo',
                        foreignField: 'problemNo',
                        as: 'allAttempts',
                    },
                },
                {
                    $addFields: {
                        totalAttempts: { $size: '$allAttempts' },
                        acceptedAttempts: {
                            $size: {
                                $filter: {
                                    input: '$allAttempts',
                                    as: 'attempt',
                                    cond: { $eq: ['$$attempt.status', 'Accepted'] },
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        successRate: {
                            $cond: {
                                if: { $gt: ['$totalAttempts', 0] },
                                then: { $multiply: [{ $divide: ['$acceptedAttempts', '$totalAttempts'] }, 100] },
                                else: 0,
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        difficulty: 1,
                        problemNo: 1,
                        successRate: 1,
                    },
                },
                { $sort: sort },
            ])
            return problems
        } catch (err) {
            console.log(err)
            throw new Error('Error finding problems')
        }
    }

    async getProblemsWithStatus(
        sort: Record<string, 1 | -1>,
        filter: Record<string, string>,
        userId: string
    ): Promise<ProblemListType[]> {
        try {
            const problems = await Problem.aggregate([
                { $match: filter },
                {
                    $lookup: {
                        from: 'Attempts',
                        localField: 'problemNo',
                        foreignField: 'problemNo',
                        as: 'allAttempts',
                    },
                },
                {
                    $addFields: {
                        totalAttempts: { $size: '$allAttempts' },
                        acceptedAttempts: {
                            $size: {
                                $filter: {
                                    input: '$allAttempts',
                                    as: 'attempt',
                                    cond: { $eq: ['$$attempt.status', 'Accepted'] },
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        successRate: {
                            $cond: {
                                if: { $gt: ['$totalAttempts', 0] },
                                then: { $multiply: [{ $divide: ['$acceptedAttempts', '$totalAttempts'] }, 100] },
                                else: 0,
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        userAttempts: {
                            $filter: {
                                input: '$allAttempts',
                                as: 'attempt',
                                cond: { $eq: ['$$attempt.userId', userId] },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        solved: {
                            $cond: {
                                if: {
                                    $gt: [
                                        {
                                            $size: {
                                                $filter: {
                                                    input: '$userAttempts',
                                                    as: 'attempt',
                                                    cond: { $eq: ['$$attempt.status', 'Accepted'] },
                                                },
                                            },
                                        },
                                        0,
                                    ],
                                },
                                then: 'solved',
                                else: 'unsolved',
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        difficulty: 1,
                        problemNo: 1,
                        status: 1,
                        solved: 1,
                        successRate: 1,
                    },
                },
                { $sort: sort },
            ])
            return problems
        } catch (err) {
            console.log(err)
            throw new Error('Error finding problems with status')
        }
    }

    async findProblemByNo(problemNo: number): Promise<ProblemType | null> {
        try {
            const problem = await Problem.findOne({ problemNo })
            return problem
        } catch (err) {
            console.log(err)
            throw new Error('Error finding problem')
        }
    }
}

export default new ProblemRepository()
