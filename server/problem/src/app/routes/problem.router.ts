import { Router } from "express";
import { ProblemController } from "../controllers/implementation/problem.controller";
import { ProblemService } from "../../services/implementation/problem.service";
import ProblemRepository from "../../repositories/implementation/problem.repository";
import { validateProblem } from "../middlewares/validate-problem.middleware";


const problemService = new ProblemService(ProblemRepository)
const problemController = new ProblemController(problemService)

const problemRouter = Router();

//! --------------- Admin ---------------- //
problemRouter.post('/admin/addProblem', validateProblem, problemController.addProblem.bind(problemController))

//! --------------- Student ---------------- //
problemRouter.get('/student/getProblems', problemController.getProblems.bind(problemController))
problemRouter.get('/student/findProblem/:problemNo', problemController.findProblem.bind(problemController));
problemRouter.post('/student/compile', problemController.compileCode.bind(problemController));

export default problemRouter