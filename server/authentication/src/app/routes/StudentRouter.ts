import { Router } from "express";
import { StudentController } from "../controllers/StudentController";
import { StudentService } from "../../services/student.service";
import StudentRepository from "../../repositories/student.repository";
import { upload } from "../../config/multer.config";
import { validateData } from "../middlewares/ValidateData";
import FormValidation from "../../utils/form-validation.util";

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
