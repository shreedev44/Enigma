import { IBaseRepository } from '@shreedev44/enigma-shared'
import { DifficultyType, LeaderboardType } from '@types'

export interface ILeaderboardRepository extends IBaseRepository<LeaderboardType> {
    create(user: Partial<LeaderboardType>): Promise<LeaderboardType>
    problemSolved(userId: string, difficulty: DifficultyType): Promise<void>
    getCount(): Promise<number>
}
