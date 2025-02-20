import { Router } from "express";
import { ProblemController } from "../controllers/ProblemController";
import { ProblemService } from "../../services/ProblemService";
import ProblemRepository from "../../repositories/ProblemRepository";
import { validateProblem } from "../middlewares/ValidateProblem";


const problemService = new ProblemService(ProblemRepository)
const problemController = new ProblemController(problemService)

const problemRouter = Router();

//! --------------- Admin ---------------- //
problemRouter.post('/admin/addProblem', validateProblem, problemController.addProblem.bind(problemController))

//! --------------- Student ---------------- //
problemRouter.get('/student/getProblems', problemController.getProblems.bind(problemController))
problemRouter.get('/student/findProblem/:problemNo', problemController.findProblem.bind(problemController));

export default problemRouter