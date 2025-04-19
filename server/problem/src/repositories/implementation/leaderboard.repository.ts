import { ILeaderboardRepository } from '@repositories/interface'
import { BaseRepository } from '@shreedev44/enigma-shared'
import Leaderboard, { LeaderboardDocument } from '@models/leaderboard.model'
import { LeaderboardType } from '@types'

class LeaderboardRepository extends BaseRepository<LeaderboardDocument> implements ILeaderboardRepository {
    constructor() {
        super(Leaderboard)
    }

    async create(user: Partial<LeaderboardDocument>): Promise<LeaderboardDocument> {
        try {
            const data = await this.model.create(user)
            return data
        } catch (err) {
            console.log(err)
            throw new Error('Error creating leaderboard row')
        }
    }

    async problemSolved(userId: string, difficulty: string): Promise<void> {
        try {
            await this.model.updateOne({ userId }, { $inc: { [`solved.${difficulty}`]: 1 } })
        } catch (err) {
            console.log(err)
            throw new Error('Error writing problem solved to leaderboard')
        }
    }

    async getCount(): Promise<number> {
        try {
            return await this.model.countDocuments()
        } catch (err) {
            console.log(err)
            throw new Error('Error getting count of the documents in leaderboard')
        }
    }

    async updateRanks(): Promise<void> {
        try {
            const rankedUsers = await Leaderboard.aggregate([
                {
                    $addFields: {
                        totalPoints: {
                            $add: [
                                { $multiply: ['$solved.beginner', 1] },
                                { $multiply: ['$solved.intermediate', 2] },
                                { $multiply: ['$solved.advanced', 4] },
                            ],
                        },
                    },
                },
                { $sort: { totalPoints: -1 } },
                {
                    $group: {
                        _id: null,
                        users: {
                            $push: {
                                userId: '$userId',
                                totalPoints: '$totalPoints',
                            },
                        },
                    },
                },
                {
                    $unwind: { path: '$users', includeArrayIndex: 'rank' },
                },
                {
                    $project: {
                        _id: 0,
                        userId: '$users.userId',
                        totalPoints: '$users.totalPoints',
                        rank: { $add: ['$rank', 1] },
                    },
                },
            ])

            const bulkOps = rankedUsers.map((user) => ({
                updateOne: {
                    filter: { userId: user.userId },
                    update: { $set: { rank: user.rank } },
                },
            }))

            if (bulkOps.length > 0) {
                const result = await Leaderboard.bulkWrite(bulkOps)
                console.log(`Successfully updated ranks for ${result.modifiedCount} users out of ${rankedUsers.length}`)
            } else {
                console.log('No ranks changes')
            }
        } catch (err) {
            console.log(err)
            throw new Error('Error updating ranks in leaderboard')
        }
    }

    async getLeaderboard(): Promise<LeaderboardType[]> {
        try {
            return await this.model.find().sort({ rank: 1 })
        } catch (err) {
            console.log(err)
            throw new Error('Error getting leaderboard')
        }
    }

    async getRankByUserId(userId: string): Promise<LeaderboardType | null> {
        try {
            const user = await this.model.findOne({ userId })
            return user
        } catch (err) {
            console.log(err)
            throw new Error('Error getting rank of a user')
        }
    }
}

export default new LeaderboardRepository()
