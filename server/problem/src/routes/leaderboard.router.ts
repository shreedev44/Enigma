import { Router } from 'express'
import LeaderboardRepository from '@repositories/implementation/leaderboard.repository'
import { LeaderboardService } from '@services/implementation'
import { LeaderboardController } from '@controllers/implementation'

const leaderboardRouter = Router()

const leaderboardService = new LeaderboardService(LeaderboardRepository)
const leaderboardController = new LeaderboardController(leaderboardService)

leaderboardRouter.get('/', leaderboardController.getLeaderboard.bind(leaderboardController))
leaderboardRouter.get('/update-ranks', leaderboardController.updateRanks.bind(leaderboardController))
leaderboardRouter.get('/rank/:userId', leaderboardController.getUserRank.bind(leaderboardController))
leaderboardRouter.get('/top-three', leaderboardController.getTopThree.bind(leaderboardController))

export default leaderboardRouter
