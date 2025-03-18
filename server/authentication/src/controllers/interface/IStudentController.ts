import { NextFunction, Request, Response } from 'express'

export interface IStudentController {
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>
    updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>
}
