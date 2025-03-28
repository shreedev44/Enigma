import Attempt from '@models/attempt.model'
import { AttemptsPerDay, AttemptType, MakeOptional, ProblemSolvedByDifficulty, ProfileStatType } from '@types'
import { IAttemptRepository } from '@repositories/interface'

class AttemptRepository implements IAttemptRepository {
    async create(
        attempt: MakeOptional<
            AttemptType,
            '_id' | 'createdAt' | 'updatedAt' | 'rejectedTestCase' | 'rejectionMessage' | 'status'
        >
    ): Promise<Omit<AttemptType, 'problemNo' | 'updatedAt' | 'userId'>> {
        try {
            const attemptData = await Attempt.create(attempt)
            const returnObj = {
                _id: attemptData._id,
                status: attemptData.status,
                language: attemptData.language,
                runTime: attemptData.runTime,
                memory: attemptData.memory,
                createdAt: attemptData.createdAt,
                testCasePassed: attemptData.testCasePassed,
                rejectedTestCase: attemptData.rejectedTestCase,
                rejectionMessage: attemptData.rejectionMessage,
                solution: attemptData.solution,
            }
            return returnObj
        } catch (err) {
            console.log(err)
            throw new Error('Error creating attempt')
        }
    }

    async getAttemptsOfUser(
        userId: string,
        problemNo: number
    ): Promise<Pick<AttemptType, '_id' | 'createdAt' | 'language' | 'status'>[]> {
        try {
            const attempts = await Attempt.find({ userId, problemNo }).sort({ createdAt: -1 })
            return attempts
        } catch (err) {
            console.log(err)
            throw new Error('Error fetching attempts by userId')
        }
    }

    async findAttemptById(attemptId: string): Promise<AttemptType | null> {
        try {
            const attempt = await Attempt.findById(attemptId)
            return attempt
        } catch (err) {
            console.log(err)
            throw new Error('Error finding attempt')
        }
    }

    async getProblemStats(userId: string): Promise<ProfileStatType | null> {
        try {
            const result = await Attempt.aggregate([
                {
                    $match: { userId },
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $group: {
                        _id: '$problemNo',
                        latestAttempt: { $first: '$$ROOT' },
                        hasAcceptedAttempt: {
                            $max: {
                                $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0],
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'Problems',
                        localField: '_id',
                        foreignField: 'problemNo',
                        as: 'problemDetails',
                    },
                },
                {
                    $unwind: '$problemDetails',
                },
                {
                    $facet: {
                        problemsSolvedByDifficulty: [
                            {
                                $match: { hasAcceptedAttempt: 1 }, // Consider any problem with an accepted attempt as solved
                            },
                            {
                                $group: {
                                    _id: '$problemDetails.difficulty',
                                    count: { $sum: 1 },
                                },
                            },
                        ],
                        totalProblemsSolved: [
                            {
                                $match: { hasAcceptedAttempt: 1 }, // Count only solved problems
                            },
                            {
                                $count: 'totalSolved',
                            },
                        ],
                        totalProblemsExist: [
                            {
                                $count: 'totalExist',
                            },
                        ],
                    },
                },
            ])

            const attemptStats = await Attempt.aggregate([
                {
                    $match: { userId },
                },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ])

            const problemsSolvedByDifficulty = result[0].problemsSolvedByDifficulty.reduce(
                (acc: ProblemSolvedByDifficulty, cur: { _id: string; count: number }) => {
                    acc[cur._id as keyof ProblemSolvedByDifficulty] = cur.count
                    return acc
                },
                { Beginner: 0, Intermediate: 0, Advanced: 0 }
            )

            return {
                problemsSolvedByDifficulty,
                totalProblemsSolved: result[0].totalProblemsSolved[0]?.totalSolved || 0,
                totalProblemsExist: result[0].totalProblemsExist[0]?.totalExist || 0,
                acceptedAttempts: attemptStats.find((stat: { _id: string }) => stat._id === 'Accepted')?.count || 0,
                notAcceptedAttempts: attemptStats
                    .filter((stat: { _id: string }) => stat._id !== 'Accepted')
                    .reduce((sum: number, stat: { count: number }) => sum + stat.count, 0),
            }
        } catch (err) {
            console.log(err)
            throw new Error('Error getting stats')
        }
    }

    async attemptsPerDay(userId: string): Promise<AttemptsPerDay[] | null> {
        try {
            const attemptsPerDay = await Attempt.aggregate([
                {
                    $match: { userId },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y/%m/%d', date: '$createdAt' },
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        date: '$_id',
                        count: 1,
                    },
                },
                {
                    $sort: { date: 1 },
                },
            ])
            return attemptsPerDay
        } catch (err) {
            console.log(err)
            throw new Error('Error getting attempts per day')
        }
    }
}

export default new AttemptRepository()
