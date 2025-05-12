import { Router } from 'express'
import { AttemptController } from '@controllers/implementation'
import { AttemptService } from '@services/implementation'
import ProblemRepository from '@repositories/implementation/problem.repository'
import AttemptRepository from '@repositories/implementation/attempt.repository'
import LeaderboardRepository from '@repositories/implementation/leaderboard.repository'

const attemptService = new AttemptService(AttemptRepository, ProblemRepository, LeaderboardRepository)
const attemptController = new AttemptController(attemptService)

const attemptRouter = Router()

attemptRouter.post('/submit-solution', attemptController.submitSolution.bind(attemptController))
attemptRouter.get('/get-attempts/:problemNo', attemptController.getAttempts.bind(attemptController))
attemptRouter.get('/find-attempt/:attemptId', attemptController.findAttempt.bind(attemptController))
attemptRouter.get('/problem-stats/:userId', attemptController.getProfileStats.bind(attemptController))
attemptRouter.get('/attempts-per-day/:userId', attemptController.getAttemptsPerDay.bind(attemptController))
attemptRouter.get('/attempt-stats', attemptController.getStats.bind(attemptController))

export default attemptRouter
