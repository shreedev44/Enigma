import { NextFunction, Request, Response } from 'express'

export interface IAdminController {
    getStudents(req: Request, res: Response, next: NextFunction): Promise<void>
    getRecruiters(req: Request, res: Response, next: NextFunction): Promise<void>
    blockOrUnblockUser(req: Request, res: Response, next: NextFunction): Promise<void>
}
