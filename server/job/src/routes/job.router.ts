import { Router } from 'express'
import { JobController } from '@controllers/implementation'
import { JobService } from '@services/implementation'
import JobRepository from '@repositories/implementation/job.repository'
// import { validateData } from '@middlewares'
// import { validationSchemas } from '@utils'

const jobService = new JobService(JobRepository)
const jobController = new JobController(jobService)

const jobRouter = Router()

jobRouter.get('/', jobController.getAllJobs.bind(jobController))
jobRouter.post(
    '/create',
    // validateData(validationSchemas.jobCreationValidationSchema),
    jobController.createJob.bind(jobController)
)
jobRouter.patch(
    '/update/:jobId',
    // validateData(validationSchemas.jobUpdateValidationSchema),
    jobController.updateJob.bind(jobController)
)
jobRouter.delete('/delete/:jobId', jobController.deleteJob.bind(jobController))
jobRouter.get('/recruiter-jobs', jobController.getJobsByUserId.bind(jobController))

export default jobRouter
