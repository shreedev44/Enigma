import { Router } from 'express'
import { UserController } from '@controllers/implementation'
import { UserService } from '@services/implementation'
import UserRepository from '@repositories/implementation/user.repository'
import StudentRepository from '@repositories/implementation/student.repository'
import RecruiterRepository from '@repositories/implementation/recruiter.repository'
import { validateData } from '@middlewares'
import { validationSchemas } from '@utils'

const userService = new UserService(UserRepository, StudentRepository, RecruiterRepository)
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
userRouter.post('/verify-otp', userController.verifyOtp.bind(userController))
userRouter.post('/resend-otp', userController.resendOtp.bind(userController))
userRouter.post(
    '/signin',
    validateData(validationSchemas.loginValidationSchema),
    userController.verifyUser.bind(userController)
)
userRouter.post('/google-auth', userController.googleAuth.bind(userController))
userRouter.post('/github-auth', userController.githubAuth.bind(userController))

userRouter.post('/change-password', userController.changePassword.bind(userController))
userRouter.patch('/reset-password', userController.resetPassword.bind(userController))
userRouter.post('/refresh-token', userController.refreshToken.bind(userController))
userRouter.get('/get-recruiters', userController.getRecruiters.bind(userController))

export default userRouter
