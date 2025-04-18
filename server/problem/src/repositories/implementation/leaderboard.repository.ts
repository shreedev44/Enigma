import { ILeaderboardRepository } from '@repositories/interface'
import { BaseRepository } from '@shreedev44/enigma-shared'
import Leaderboard, { LeaderboardDocument } from '@models/leaderboard.model'
import { DifficultyType } from '@types'

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

    async problemSolved(userId: string, difficulty: DifficultyType): Promise<void> {
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
}

export default new LeaderboardRepository()
