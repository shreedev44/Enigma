import { Router } from 'express'
import { JobController } from '@controllers/implementation'
import { JobService } from '@services/implementation'
import JobRepository from '@repositories/implementation/job.repository'
import { validateData, validateRole } from '@middlewares'
import { validationSchemas } from '@constants'

const jobService = new JobService(JobRepository)
const jobController = new JobController(jobService)

const jobRouter = Router()

jobRouter.get('/', jobController.getAllJobs.bind(jobController))
jobRouter.post(
    '/create',
    validateRole('recruiter'),
    validateData(validationSchemas.jobCreationValidationSchema),
    jobController.createJob.bind(jobController)
)
jobRouter.patch(
    '/update/:jobId',
    validateRole('recruiter'),
    validateData(validationSchemas.jobUpdateValidationSchema),
    jobController.updateJob.bind(jobController)
)
jobRouter.patch('/hide/:jobId', jobController.deleteJob.bind(jobController))
jobRouter.get('/recruiter-jobs', jobController.getJobsByUserId.bind(jobController))
jobRouter.get('/job-details/:jobId', jobController.getJobDetails.bind(jobController))
jobRouter.get('/job-stats', validateRole('admin'), jobController.getJobStats.bind(jobController))
jobRouter.get('/total-jobs', validateRole('recruiter'), jobController.getTotalJobsPosted.bind(jobController))

export default jobRouter
