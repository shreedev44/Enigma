import { Request, Response, NextFunction } from 'express'

export interface IProblemController {
    addProblem(req: Request, res: Response, next: NextFunction): Promise<void>
    getProblems(req: Request, res: Response, next: NextFunction): Promise<void>
    findProblem(req: Request, res: Response, next: NextFunction): Promise<void>
    compileCode(req: Request, res: Response, next: NextFunction): Promise<void>
    runSolution(req: Request, res: Response, next: NextFunction): Promise<void>
}
