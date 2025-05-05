import { Router } from 'express'
import { AdminController } from '@controllers/implementation'
import { AdminService } from '@services/implementation'
import UserRepository from '@repositories/implementation/user.repository'

const adminService = new AdminService(UserRepository)
const adminController = new AdminController(adminService)

const adminRouter = Router()

adminRouter.get('/get-students', adminController.getStudents.bind(adminController))
adminRouter.get('/get-recruiters', adminController.getRecruiters.bind(adminController))
adminRouter.patch('/block-or-unblock', adminController.blockOrUnblockUser.bind(adminController))
adminRouter.get('/user-stats', adminController.getStats.bind(adminController))

export default adminRouter
