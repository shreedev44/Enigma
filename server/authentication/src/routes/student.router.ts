import { Router } from 'express'
import { StudentController } from '@controllers/implementation'
import { StudentService } from '@services/implementation'
import StudentRepository from '@repositories/implementation/student.repository'
import { upload } from '@configs'
import { validateData } from '@middlewares'
import { validationSchemas } from '@utils'

const studentService = new StudentService(StudentRepository)
const studentController = new StudentController(studentService)

const studentRouter = Router()

studentRouter.get('/get-profile', studentController.getProfile.bind(studentController))
studentRouter.patch(
    '/update-profile',
    upload.single('profilePicture'),
    validateData(validationSchemas.studentProfileValidationSchema),
    studentController.updateProfile.bind(studentController)
)

export default studentRouter
