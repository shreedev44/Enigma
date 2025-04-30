import { Router } from 'express'
import { InterviewController } from '@controllers/implementation'
import { InterviewService } from '@services/implementation'
import InterviewRepository from '@repositories/implementation/interview.repository'
import { validateRole } from '@middlewares'

const interviewService = new InterviewService(InterviewRepository)
const interviewController = new InterviewController(interviewService)

const interviewRouter = Router()

interviewRouter.post('/schedule', validateRole('recruiter'), interviewController.schedule.bind(interviewController))
interviewRouter.get(
    '/my-interviews',
    validateRole('recruiter'),
    interviewController.getInterviews.bind(interviewController)
)

export default interviewRouter
