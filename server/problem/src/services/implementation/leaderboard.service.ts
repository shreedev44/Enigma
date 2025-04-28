import { ILeaderboardRepository } from '@repositories/interface'
import { ILeaderboardService } from '@services/interface'
import { LeaderboardDTO } from '@dtos'
import { createHttpError } from '@utils'
import { _HttpStatus, Messages } from '@constants'
import { Types } from 'mongoose'

export class LeaderboardService implements ILeaderboardService {
    constructor(private _leaderboardRepository: ILeaderboardRepository) {}

    async updateRanks(): Promise<void> {
        await this._leaderboardRepository.updateRanks()
    }

    async getLeaderboard(
        page: number,
        userId: string | null
    ): Promise<InstanceType<typeof LeaderboardDTO.LeaderboardInfo>> {
        const leaderboardData = await this._leaderboardRepository.getLeaderboard()

        const dataPerPage = 1
        const totalPages = Math.ceil(leaderboardData.length / dataPerPage)

        const startIndex = (page - 1) * dataPerPage
        const endIndex = startIndex + dataPerPage

        if (userId) {
            const rank = await this._leaderboardRepository.getRankByUserId(new Types.ObjectId(userId))
            if (!rank) {
                throw createHttpError(_HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND)
            }
            return new LeaderboardDTO.LeaderboardInfo({
                totalPages,
                leaderboard: leaderboardData.slice(startIndex, endIndex),
                rank,
            })
        }

        return new LeaderboardDTO.LeaderboardInfo({
            totalPages,
            leaderboard: leaderboardData.slice(startIndex, endIndex),
        })
    }

    async getRankByUserId(userId: string): Promise<{ rank: number }> {
        const leaderboard = await this._leaderboardRepository.getRankByUserId(new Types.ObjectId(userId))

        if (!leaderboard) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND)
        }

        return { rank: leaderboard.rank }
    }
}
