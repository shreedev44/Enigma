import { IBaseRepository } from '@shreedev44/enigma-shared'
import { LeaderboardType } from '@types'

export interface ILeaderboardRepository extends IBaseRepository<LeaderboardType> {
    create(user: Partial<LeaderboardType>): Promise<LeaderboardType>
    problemSolved(userId: string, difficulty: string): Promise<void>
    getCount(): Promise<number>
    updateRanks(): Promise<void>
    getLeaderboard(): Promise<LeaderboardType[]>
    getRankByUserId(userId: string): Promise<LeaderboardType | null>
}
