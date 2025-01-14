import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../../services/UserService";
import UserRepository from "../../repositories/UserRepository";
import StudentRepository from "../../repositories/StudentRepository";
import { validateData } from "../middlewares/ValidateData";
import FormValidation from "../../utils/FormValidation";

const userService = new UserService(UserRepository, StudentRepository);
const userController = new UserController(userService);

const userRouter = Router();

userRouter.post("/register", validateData(FormValidation.studentSignupValidationSchema, 'student'), userController.register.bind(userController));
userRouter.post("/verifyOtp", userController.verifyOtp.bind(userController));
userRouter.post("/signin", validateData(FormValidation.loginValidationSchema, 'student'), userController.verifyUser.bind(userController));



export default userRouter;
