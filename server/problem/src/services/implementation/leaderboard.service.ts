import { ILeaderboardRepository } from '@repositories/interface'
import { ILeaderboardService } from '@services/interface'
import { LeaderboardDTO } from '@dtos'
import { createHttpError } from '@utils'
import { _HttpStatus, Messages } from '@constants'
import { Types } from 'mongoose'
import { redisClient } from '@configs'

export class LeaderboardService implements ILeaderboardService {
    constructor(private _leaderboardRepository: ILeaderboardRepository) {}

    async updateRanks(): Promise<void> {
        await this._leaderboardRepository.updateRanks()
        await redisClient.del('leaderboard-page-1')
        await redisClient.del('leaderboard-page-2')
        await redisClient.del('leaderboard-page-3')
        await redisClient.del('leaderboard-total-pages')
    }

    async getLeaderboard(
        page: number,
        userId: string | null
    ): Promise<InstanceType<typeof LeaderboardDTO.LeaderboardInfo>> {
        const dataPerPage = 10
        const startIndex = (page - 1) * dataPerPage
        const endIndex = startIndex + dataPerPage
        const cachedLeaderboard = await redisClient.get(`leaderboard-page-${page}`)
        if (cachedLeaderboard) {
            const { leaderboardData } = JSON.parse(cachedLeaderboard)
            const totalPages = await redisClient.get('leaderboard-total-pages')
            if (userId) {
                const rank = await this._leaderboardRepository.getRankByUserId(new Types.ObjectId(userId))
                if (!rank) {
                    throw createHttpError(_HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND)
                }
                return new LeaderboardDTO.LeaderboardInfo({
                    totalPages: Number(totalPages),
                    leaderboard: leaderboardData.slice(startIndex, endIndex),
                    rank,
                })
            }
            return new LeaderboardDTO.LeaderboardInfo({
                totalPages: Number(totalPages),
                leaderboardData: leaderboardData,
            })
        } else {
            const leaderboardData = await this._leaderboardRepository.getLeaderboard()

            const totalPages = Math.ceil(leaderboardData.length / dataPerPage)

            if (page >= 1 && page <= 3) {
                const jsonObj = JSON.stringify({ leaderboardData })
                await redisClient.setEx(`leaderboard-page-${page}`, 86400, jsonObj)
                await redisClient.setEx('leaderboard-total-pages', 86400, String(totalPages))
            }

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
    }

    async getRankByUserId(userId: string): Promise<{ rank: number }> {
        const leaderboard = await this._leaderboardRepository.getRankByUserId(new Types.ObjectId(userId))

        if (!leaderboard) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND)
        }

        return { rank: leaderboard.rank }
    }

    async getTopThree(): Promise<InstanceType<typeof LeaderboardDTO.TopThree>> {
        const leaderboard = await this._leaderboardRepository.getLeaderboard()

        return new LeaderboardDTO.TopThree({ leaderboard: leaderboard.slice(0, 3) })
    }
}
