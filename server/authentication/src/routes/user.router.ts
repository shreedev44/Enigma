import { Router } from 'express'
import { UserController } from '@controllers/implementation'
import { UserService } from '@services/implementation'
import UserRepository from '@repositories/implementation/user.repository'
import StudentRepository from '@repositories/implementation/student.repository'
import RecruiterRepository from '@repositories/implementation/recruiter.repository'
import { validateData } from '@middlewares'
import { validationSchemas } from '@utils'

const userService = new UserService(
  UserRepository,
  StudentRepository,
  RecruiterRepository
)
const userController = new UserController(userService)

const userRouter = Router()

userRouter.post(
  '/student/register',
  validateData(validationSchemas.studentSignupValidationSchema),
  userController.register.bind(userController)
)
userRouter.post(
  '/recruiter/register',
  validateData(validationSchemas.recruiterSignupValidation),
  userController.register.bind(userController)
)
userRouter.post('/verifyOtp', userController.verifyOtp.bind(userController))
userRouter.post('/resendOtp', userController.resendOtp.bind(userController))
userRouter.post(
  '/signin',
  validateData(validationSchemas.loginValidationSchema),
  userController.verifyUser.bind(userController)
)
userRouter.post('/googleAuth', userController.googleAuth.bind(userController))
userRouter.post('/githubAuth', userController.githubAuth.bind(userController))

userRouter.post(
  '/changePassword',
  userController.changePassword.bind(userController)
)
userRouter.patch(
  '/resetPassword',
  userController.resetPassword.bind(userController)
)
userRouter.post(
  '/refreshToken',
  userController.refreshToken.bind(userController)
)

export default userRouter
