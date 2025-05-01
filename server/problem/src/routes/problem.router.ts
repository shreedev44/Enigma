import { Router } from 'express'
import { ProblemController } from '@controllers/implementation'
import { ProblemService } from '@services/implementation'
import ProblemRepository from '@repositories/implementation/problem.repository'
import { validateData, validateRole } from '@middlewares'
import { validationSchemas } from '@constants'

const problemService = new ProblemService(ProblemRepository)
const problemController = new ProblemController(problemService)

const problemRouter = Router()

//! --------------- Admin ---------------- //
problemRouter.post(
    '/add-problem',
    validateRole('admin'),
    validateData(validationSchemas.problemCreateValidationSchema),
    problemController.addProblem.bind(problemController)
)
problemRouter.patch(
    '/update-problem/:problemId',
    validateRole('admin'),
    validateData(validationSchemas.problemUpdateValidationSchema),
    problemController.updatedProblem.bind(problemController)
)
problemRouter.patch(
    '/unlist-problem/:problemId',
    validateRole('admin'),
    problemController.unlistProblem.bind(problemController)
)
problemRouter.patch(
    '/list-problem/:problemId',
    validateRole('admin'),
    problemController.listProblem.bind(problemController)
)

//! --------------- Common ---------------- //
problemRouter.get('/get-problems', problemController.getProblems.bind(problemController))
problemRouter.get('/find-problem/:problemNo', problemController.findProblem.bind(problemController))
problemRouter.post('/compile', problemController.compileCode.bind(problemController))
problemRouter.post('/run-solution', problemController.runSolution.bind(problemController))

export default problemRouter
