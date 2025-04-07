import { Router } from 'express'
import { ProblemController } from '@controllers/implementation'
import { ProblemService } from '@services/implementation'
import ProblemRepository from '@repositories/implementation/problem.repository'
import { validateProblem } from '@middlewares'

const problemService = new ProblemService(ProblemRepository)
const problemController = new ProblemController(problemService)

const problemRouter = Router()

//! --------------- Admin ---------------- //
problemRouter.post('/add-problem', validateProblem, problemController.addProblem.bind(problemController))

//! --------------- Student ---------------- //
problemRouter.get('/get-problems', problemController.getProblems.bind(problemController))
problemRouter.get('/find-problem/:problemNo', problemController.findProblem.bind(problemController))
problemRouter.post('/compile', problemController.compileCode.bind(problemController))
problemRouter.post('/run-solution', problemController.runSolution.bind(problemController))

export default problemRouter
