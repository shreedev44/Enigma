import { LeaderboardDTO } from '@dtos'

export interface ILeaderboardService {
    updateRanks(): Promise<void>
    getLeaderboard(page: number, userId: string | null): Promise<InstanceType<typeof LeaderboardDTO.LeaderboardInfo>>
    getRankByUserId(userId: string): Promise<{ rank: number }>
    getTopThree(): Promise<InstanceType<typeof LeaderboardDTO.TopThree>>
}
