import { Router } from 'express'
import { AttemptController } from '@controllers/implementation'
import { AttemptService } from '@services/implementation'
import ProblemRepository from '@repositories/implementation/problem.repository'
import AttemptRepository from '@repositories/implementation/attempt.repository'

const attemptService = new AttemptService(AttemptRepository, ProblemRepository)
const attemptController = new AttemptController(attemptService)

const attemptRouter = Router()

attemptRouter.post('/submit-solution', attemptController.submitSolution.bind(attemptController))
attemptRouter.get('/get-attempts/:problemNo', attemptController.getAttempts.bind(attemptController))
attemptRouter.get('/find-attempt/:attemptId', attemptController.findAttempt.bind(attemptController))
attemptRouter.get('/problem-stats', attemptController.getProfileStats.bind(attemptController))
attemptRouter.get('/attempts-per-day', attemptController.getAttemptsPerDay.bind(attemptController))

export default attemptRouter
