import { Router } from "express";
import { StudentController } from "../controllers/StudentController";
import { StudentService } from "../../services/StudentService";
import StudentRepository from "../../repositories/StudentRepository";
import { upload } from "../../config/Multer";
import { validateData } from "../middlewares/ValidateData";
import FormValidation from "../../utils/FormValidation";

const studentService = new StudentService(StudentRepository);
const studentController = new StudentController(studentService);

const studentRouter = Router();

studentRouter.get(
  "/getProfile",
  studentController.getProfile.bind(studentController)
);
studentRouter.patch(
  "/updateProfile",
  upload.single("profilePicture"),
  validateData(FormValidation.studentProfileValidationSchema),
  studentController.updateProfile.bind(studentController)
);

export default studentRouter;
