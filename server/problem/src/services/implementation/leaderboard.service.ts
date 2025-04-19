import { ILeaderboardRepository } from '@repositories/interface'
import { ILeaderboardService } from '@services/interface'

export class LeaderboardService implements ILeaderboardService {
    constructor(private _leaderboardRepository: ILeaderboardRepository) {}

    async updateRanks(): Promise<void> {
        await this._leaderboardRepository.updateRanks()
    }
}
