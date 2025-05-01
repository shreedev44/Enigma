import Problem, { ProblemDocument } from '@models/problem.model'
import { ProblemListType, ProblemType } from '@types'
import { IProblemRepository } from '@repositories/interface'
import { BaseRepository } from '@shreedev44/enigma-shared'

class ProblemRepository extends BaseRepository<ProblemDocument> implements IProblemRepository {
    constructor() {
        super(Problem)
    }

    async create(problem: Partial<ProblemType>): Promise<ProblemDocument> {
        try {
            const problemData = await this.model.create(problem)
            return problemData
        } catch (err) {
            console.log(err)
            throw new Error('Error creating problem')
        }
    }

    async findByTitle(title: string): Promise<ProblemDocument | null> {
        try {
            const problem = await this.model.findOne({ title })
            return problem
        } catch (err) {
            console.log(err)
            throw new Error('Error checking whether problem exists')
        }
    }

    async findLatestProblem(): Promise<ProblemDocument | null> {
        try {
            const latest = await this.model.findOne().sort({ createdAt: -1 })
            return latest
        } catch (err) {
            console.log(err)
            throw new Error('Error finding latest problem')
        }
    }

    async getProblems(sort: Record<string, 1 | -1>, filter: Record<string, string>): Promise<ProblemListType[]> {
        try {
            const problems = await this.model.aggregate([
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
                        createdAt: 1,
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
            const problems = await this.model.aggregate([
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

    async findProblemByNo(problemNo: number, role: string): Promise<ProblemDocument | null> {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const query: Record<string, any> = { problemNo }
            if (role === 'student') {
                query.status = 'listed'
            }
            const problem = await this.model.findOne(query)
            return problem
        } catch (err) {
            console.log(err)
            throw new Error('Error finding problem')
        }
    }

    async updateProblemById(problemId: string, problem: Partial<ProblemType>): Promise<ProblemDocument | null> {
        try {
            return await this.model.findByIdAndUpdate(problemId, problem)
        } catch (err) {
            console.log(err)
            throw new Error('Error updating problem')
        }
    }

    async unlistProblemById(problemId: string): Promise<ProblemDocument | null> {
        try {
            return await this.model.findByIdAndUpdate(problemId, { status: 'unlisted' })
        } catch (err) {
            console.log(err)
            throw new Error('Error unlisting problem')
        }
    }

    async listProblemById(problemId: string): Promise<ProblemDocument | null> {
        try {
            return await this.model.findByIdAndUpdate(problemId, { status: 'listed' })
        } catch (err) {
            console.log(err)
            throw new Error('Error listing problem')
        }
    }
}

export default new ProblemRepository()
