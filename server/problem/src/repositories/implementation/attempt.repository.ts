import Attempt, { AttemptDocument } from '@models/attempt.model'
import { AttemptsPerDay, AttemptType, ProblemSolvedByDifficulty, ProfileStatType } from '@types'
import { IAttemptRepository } from '@repositories/interface'
import { BaseRepository } from '@shreedev44/enigma-shared'

class AttemptRepository extends BaseRepository<AttemptDocument> implements IAttemptRepository {
    constructor() {
        super(Attempt)
    }

    async create(attempt: Partial<AttemptType>): Promise<AttemptDocument> {
        try {
            const attemptData = this.model.create(attempt)
            return attemptData
        } catch (err) {
            console.log(err)
            throw new Error('Error creating attempt')
        }
    }

    async getAttemptsOfUser(
        userId: string,
        problemNo: number
    ): Promise<Pick<AttemptDocument, '_id' | 'createdAt' | 'language' | 'status'>[]> {
        try {
            const attempts = await this.model.find({ userId, problemNo }).sort({ createdAt: -1 })
            return attempts
        } catch (err) {
            console.log(err)
            throw new Error('Error fetching attempts by userId')
        }
    }

    async findAttemptById(attemptId: string): Promise<AttemptDocument | null> {
        try {
            const attempt = await this.model.findById(attemptId)
            return attempt
        } catch (err) {
            console.log(err)
            throw new Error('Error finding attempt')
        }
    }

    async getProblemStats(userId: string): Promise<Omit<ProfileStatType, 'totalProblemsExist'> | null> {
        try {
            const result = await this.model.aggregate([
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
                                $match: { hasAcceptedAttempt: 1 },
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
                                $match: { hasAcceptedAttempt: 1 },
                            },
                            {
                                $count: 'totalSolved',
                            },
                        ],
                    },
                },
            ])

            const attemptStats = await this.model.aggregate([
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
            const attemptsPerDay = await this.model.aggregate([
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

    async isSolved(userId: string, problemNo: number): Promise<boolean> {
        try {
            const attempt = await this.model.findOne({ userId, problemNo, status: 'Accepted' })
            return attempt ? true : false
        } catch (err) {
            console.log(err)
            throw new Error('Error checking whether problem is solved')
        }
    }

    async getStats(): Promise<{
        totalAttempts: number
        attemptsPerDay: number
        acceptanceRate: number
        attemptsByDate: { date: string; count: number }[]
    }> {
        try {
            const totalAttempts = await this.model.countDocuments()

            const attemptsPerDayData = await this.model.aggregate([
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        date: '$_id.date',
                        count: 1,
                    },
                },
                {
                    $sort: { date: 1 },
                },
                {
                    $group: {
                        _id: null,
                        averageAttemptsPerDay: { $avg: '$count' },
                        attemptsByDate: { $push: { date: '$date', count: '$count' } },
                    },
                },
            ])

            const acceptedAttempts = await this.model.countDocuments({ status: 'Accepted' })
            const acceptanceRate = totalAttempts > 0 ? (acceptedAttempts / totalAttempts) * 100 : 0

            return {
                totalAttempts,
                attemptsPerDay: attemptsPerDayData[0]?.averageAttemptsPerDay || 0,
                acceptanceRate,
                attemptsByDate: attemptsPerDayData[0]?.attemptsByDate || [],
            }
        } catch (err) {
            console.log(err)
            throw new Error('Error getting stats')
        }
    }
}

export default new AttemptRepository()
