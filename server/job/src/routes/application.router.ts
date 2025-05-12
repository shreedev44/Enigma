import { Router } from 'express'
import { ApplicationController } from '@controllers/implementation'
import { ApplicationService } from '@services/implementation'
import ApplicationRepository from '@repositories/implementation/application.repository'
import { upload, validateRole } from '@middlewares'
import JobRepository from '@repositories/implementation/job.repository'
import InterviewRepository from '@repositories/implementation/interview.repository'

const applicationService = new ApplicationService(ApplicationRepository, JobRepository, InterviewRepository)
const applicationController = new ApplicationController(applicationService)

const applicationRouter = Router()

applicationRouter.post(
    '/apply/:jobId',
    validateRole('student'),
    upload.single('resume'),
    applicationController.apply.bind(applicationController)
)
applicationRouter.get('/job-stats', applicationController.getApplicationStats.bind(applicationController))
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
    '/job-applications',
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
applicationRouter.get(
    '/download-resume/:jobId/:applicationId',
    validateRole('recruiter'),
    applicationController.getResumeUrl.bind(applicationController)
)
applicationRouter.get(
    '/:jobId/:applicationId',
    validateRole('recruiter'),
    applicationController.getApplicationDetails.bind(applicationController)
)
applicationRouter.patch(
    '/shortlist-application/:jobId/:applicationId',
    validateRole('recruiter'),
    applicationController.shortlistSingleApplication.bind(applicationController)
)
applicationRouter.patch(
    '/remove-from-shortlist/:jobId/:applicationId',
    validateRole('recruiter'),
    applicationController.removeApplicationFromShortlist.bind(applicationController)
)
applicationRouter.patch(
    '/accept-schedule',
    validateRole('student'),
    applicationController.acceptSchedule.bind(applicationController)
)
applicationRouter.patch(
    '/reject-schedule',
    validateRole('student'),
    applicationController.rejectSchedule.bind(applicationController)
)

export default applicationRouter
