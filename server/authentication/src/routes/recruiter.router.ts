import { Router } from "express";
import { RecruiterController } from "@controllers/implementation";
import { RecruiterService } from "@services/implementation";
import RecruiterRepository from "@repositories/implementation/recruiter.repository";
import { upload } from "@configs";
import { validateData } from "@middlewares";
import {validationSchemas} from "@utils"

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
  validateData(validationSchemas.recruiterProfileValidationSchema),
  recruiterController.updateProfile.bind(recruiterController)
);

export default recruiterRouter