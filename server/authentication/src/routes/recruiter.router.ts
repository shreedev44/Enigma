import { Router } from 'express'
import { RecruiterController } from '@controllers/implementation'
import { RecruiterService } from '@services/implementation'
import RecruiterRepository from '@repositories/implementation/recruiter.repository'
import { validateData, upload } from '@middlewares'
import { validationSchemas } from '@utils'

const recruiterService = new RecruiterService(RecruiterRepository)
const recruiterController = new RecruiterController(recruiterService)

const recruiterRouter = Router()

recruiterRouter.get('/get-profile', recruiterController.getProfile.bind(recruiterController))
recruiterRouter.patch(
    '/update-profile',
    upload.single('profilePicture'),
    validateData(validationSchemas.recruiterProfileValidationSchema),
    recruiterController.updateProfile.bind(recruiterController)
)

export default recruiterRouter
