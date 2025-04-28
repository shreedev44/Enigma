import { IBaseRepository } from '@shreedev44/enigma-shared'
import { LeaderboardType } from '@types'
import { Types } from 'mongoose'

export interface ILeaderboardRepository extends IBaseRepository<LeaderboardType> {
    create(user: Partial<LeaderboardType>): Promise<LeaderboardType>
    problemSolved(userId: string, difficulty: string): Promise<void>
    getCount(): Promise<number>
    updateRanks(): Promise<void>
    getLeaderboard(): Promise<LeaderboardType[]>
    getRankByUserId(userId: Types.ObjectId): Promise<LeaderboardType | null>
}
