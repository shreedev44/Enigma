import { Router } from 'express'
import { BlacklistController } from '@controllers/implementation'
import { BlacklistService } from '@services/implementation'
import BlacklistRepository from '@repositories/implementation/blacklist.repository'
import { validateRole } from '@middlewares'

const blacklistService = new BlacklistService(BlacklistRepository)
const blacklistController = new BlacklistController(blacklistService)

const blacklistRouter = Router()

blacklistRouter.get('/', validateRole('recruiter'), blacklistController.getBlacklist.bind(blacklistController))
blacklistRouter.post('/', validateRole('recruiter'), blacklistController.blacklistApplicant.bind(blacklistController))
blacklistRouter.patch(
    '/remove',
    validateRole('recruiter'),
    blacklistController.removeFromBlacklist.bind(blacklistController)
)

export default blacklistRouter
