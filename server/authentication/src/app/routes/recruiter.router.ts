import { Router } from "express";
import { RecruiterController } from "../controllers/recruiter.controller";
import { RecruiterService } from "../../services/recruiter.service";
import RecruiterRepository from "../../repositories/recruiter.repository";
import { upload } from "../../config/multer.config";
import { validateData } from "../middlewares/validate-data.middleware";
import FormValidation from "../../utils/form-validation.util";

const recruiterService = new RecruiterService(RecruiterRepository);
const recruiterController = new RecruiterController(recruiterService);

const recruiterRouter = Router();

recruiterRouter.get(
  "/getProfile",
  recruiterController.getProfile.bind(recruiterController)
);
recruiterRouter.patch(
  "/updateProfile",
  upload.single("profilePicture"),
  validateData(FormValidation.recruiterProfileValidationSchema),
  recruiterController.updateProfile.bind(recruiterController)
);

export default recruiterRouter