import { Router } from 'express'
import { ApplicationController } from '@controllers/implementation'
import { ApplicationService } from '@services/implementation'
import ApplicationRepository from '@repositories/implementation/application.repository'
import { upload, validateRole } from '@middlewares'

const applicationService = new ApplicationService(ApplicationRepository)
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
applicationRouter.get(
    '/job-applications/:jobId',
    validateRole('recruiter'),
    applicationController.getApplicationsByJob.bind(applicationController)
)

export default applicationRouter
