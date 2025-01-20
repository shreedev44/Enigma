import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../../services/UserService";
import UserRepository from "../../repositories/UserRepository";
import StudentRepository from "../../repositories/StudentRepository";
import RecruiterRepository from "../../repositories/RecruiterRepository";
import { validateData } from "../middlewares/ValidateData";
import FormValidation from "../../utils/FormValidation";

const userService = new UserService(
  UserRepository,
  StudentRepository,
  RecruiterRepository
);
const userController = new UserController(userService);

const userRouter = Router();


//! ------------- Student -------------- //
userRouter.post(
  "/register",
  validateData(FormValidation.studentSignupValidationSchema, "student"),
  userController.register.bind(userController)
);
userRouter.post("/verifyOtp", userController.verifyOtp.bind(userController));
userRouter.post("/resendOtp", userController.resendOtp.bind(userController));
userRouter.post(
  "/signin",
  validateData(FormValidation.loginValidationSchema, "student"),
  userController.verifyUser.bind(userController)
);
userRouter.post(
  "/googleAuth",
  validateData({}, "student"),
  userController.googleAuth.bind(userController)
);
userRouter.post("/githubAuth", userController.githubAuth.bind(userController));




//! ------------- Recruiter -------------- //
userRouter.post(
  "/recruiter/register",
  validateData(FormValidation.recruiterSignupValidation, "recruiter"),
  userController.register.bind(userController)
);
userRouter.post(
  "/recruiter/verifyOtp",
  userController.verifyOtp.bind(userController)
);
userRouter.post("/recruiter/resendOtp", userController.resendOtp.bind(userController));
userRouter.post(
  "/recruiter/signin",
  validateData(FormValidation.loginValidationSchema, "recruiter"),
  userController.verifyUser.bind(userController)
);
userRouter.post(
  "/recruiter/googleAuth",
  validateData({}, "recruiter"),
  userController.googleAuth.bind(userController)
);



//! ------------- Admin -------------- //
userRouter.post(
  "/admin/signin",
  validateData(FormValidation.loginValidationSchema, "admin"),
  userController.verifyUser.bind(userController)
);

export default userRouter;
