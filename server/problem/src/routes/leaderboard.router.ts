import { Router } from 'express'
import LeaderboardRepository from '@repositories/implementation/leaderboard.repository'
import { LeaderboardService } from '@services/implementation'
import { LeaderboardController } from '@controllers/implementation'

const leaderboardRouter = Router()

const leaderboardService = new LeaderboardService(LeaderboardRepository)
const leaderboardController = new LeaderboardController(leaderboardService)

leaderboardRouter.get('/update-ranks', leaderboardController.updateRanks.bind(leaderboardController))

export default leaderboardRouter
