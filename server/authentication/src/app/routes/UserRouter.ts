import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../../services/user.service";
import UserRepository from "../../repositories/user.repository";
import StudentRepository from "../../repositories/student.repository";
import RecruiterRepository from "../../repositories/recruiter.repository";
import { validateData } from "../middlewares/ValidateData";
import FormValidation from "../../utils/form-validation.util";

const userService = new UserService(
  UserRepository,
  StudentRepository,
  RecruiterRepository
);
const userController = new UserController(userService);

const userRouter = Router();


userRouter.post(
  "/student/register",
  validateData(FormValidation.studentSignupValidationSchema),
  userController.register.bind(userController)
);
userRouter.post(
  "/recruiter/register",
  validateData(FormValidation.recruiterSignupValidation),
  userController.register.bind(userController)
);
userRouter.post("/verifyOtp", userController.verifyOtp.bind(userController));
userRouter.post("/resendOtp", userController.resendOtp.bind(userController));
userRouter.post(
  "/signin",
  validateData(FormValidation.loginValidationSchema),
  userController.verifyUser.bind(userController)
);
userRouter.post("/googleAuth", userController.googleAuth.bind(userController));
userRouter.post("/githubAuth", userController.githubAuth.bind(userController));

userRouter.post(
  "/changePassword",
  userController.changePassword.bind(userController)
);
userRouter.patch(
  "/resetPassword",
  userController.resetPassword.bind(userController)
);
userRouter.post(
  "/refreshToken",
  userController.refreshToken.bind(userController)
);

export default userRouter;
