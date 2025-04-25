import { Router } from 'express'
import { ApplicationController } from '@controllers/implementation'
import { ApplicationService } from '@services/implementation'
import ApplicationRepository from '@repositories/implementation/application.repository'
import { upload, validateRole } from '@middlewares'
import JobRepository from '@repositories/implementation/job.repository'

const applicationService = new ApplicationService(ApplicationRepository, JobRepository)
const applicationController = new ApplicationController(applicationService)

const applicationRouter = Router()

applicationRouter.post(
    '/apply/:jobId',
    validateRole('student'),
    upload.single('resume'),
    applicationController.apply.bind(applicationController)
)
applicationRouter.delete(
    '/delete/:applicationId',
    validateRole('student'),
    applicationController.deleteApplication.bind(applicationController)
)
applicationRouter.get(
    '/my-applications',
    validateRole('student'),
    applicationController.getMyApplications.bind(applicationController)
)
applicationRouter.post(
    '/job-applications/:jobId',
    validateRole('recruiter'),
    applicationController.getApplicationsByJob.bind(applicationController)
)
applicationRouter.post(
    '/shortlist-applications/:jobId',
    validateRole('recruiter'),
    applicationController.shortlistApplications.bind(applicationController)
)
applicationRouter.get(
    '/shortlist/:jobId',
    validateRole('recruiter'),
    applicationController.getShortlist.bind(applicationController)
)

export default applicationRouter
