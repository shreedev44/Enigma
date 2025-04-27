import { NextFunction, Request, Response } from 'express'

export interface IUserController {
    register(req: Request, res: Response, next: NextFunction): Promise<void>
    verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>
    resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>
    verifyUser(req: Request, res: Response, next: NextFunction): Promise<void>
    googleAuth(req: Request, res: Response, next: NextFunction): Promise<void>
    githubAuth(req: Request, res: Response, next: NextFunction): Promise<void>
    changePassword(req: Request, res: Response, next: NextFunction): Promise<void>
    resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>
    refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>
    getRecruiters(req: Request, res: Response, next: NextFunction): Promise<void>
}
