import { Router } from "express";
import { AdminController } from "@controllers/implementation";
import { AdminService } from "@services/implementation";
import UserRepository from "@repositories/implementation/user.repository";

const adminService = new AdminService(UserRepository);
const adminController = new AdminController(adminService);

const adminRouter = Router();

adminRouter.get(
  "/getStudents",
  adminController.getStudents.bind(adminController)
);
adminRouter.get(
  "/getRecruiters",
  adminController.getRecruiters.bind(adminController)
);
adminRouter.patch(
  "/blockOrUnblock",
  adminController.blockOrUnblockUser.bind(adminController)
);

export default adminRouter;
