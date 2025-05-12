import { Router } from 'express'
import { InterviewController } from '@controllers/implementation'
import { InterviewService } from '@services/implementation'
import InterviewRepository from '@repositories/implementation/interview.repository'
import { validateRole } from '@middlewares'
import ApplicationRepository from '@repositories/implementation/application.repository'
import JobRepository from '@repositories/implementation/job.repository'
import SubscriptionRepository from '@repositories/implementation/subscription.repository'

const interviewService = new InterviewService(
    InterviewRepository,
    ApplicationRepository,
    JobRepository,
    SubscriptionRepository
)
const interviewController = new InterviewController(interviewService)

const interviewRouter = Router()

interviewRouter.post('/schedule', validateRole('recruiter'), interviewController.schedule.bind(interviewController))
interviewRouter.get(
    '/my-interviews',
    validateRole('recruiter'),
    interviewController.getInterviews.bind(interviewController)
)
interviewRouter.get(
    '/total-interviews',
    validateRole('recruiter'),
    interviewController.getTotalInterviews.bind(interviewController)
)

export default interviewRouter
