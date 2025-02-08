import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { AdminService } from "../../services/AdminService";
import UserRepository from "../../repositories/UserRepository";

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
