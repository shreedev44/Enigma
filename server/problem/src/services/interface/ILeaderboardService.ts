import { LeaderboardDTO } from '@dtos'

export interface ILeaderboardService {
    updateRanks(): Promise<void>
    getLeaderboard(page: number, userId: string | null): Promise<InstanceType<typeof LeaderboardDTO.LeaderboardInfo>>
}
