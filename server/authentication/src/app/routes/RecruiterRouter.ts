import { Router } from "express";
import { RecruiterController } from "../controllers/RecruiterController";
import { RecruiterService } from "../../services/RecruiterService";
import RecruiterRepository from "../../repositories/RecruiterRepository";
import { upload } from "../../config/Multer";
import { validateData } from "../middlewares/ValidateData";
import FormValidation from "../../utils/FormValidation";

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