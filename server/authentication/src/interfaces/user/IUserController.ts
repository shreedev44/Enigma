import { Request, Response } from "express";

export interface IUserController {
    register(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;
    verifyUser(req: Request, res: Response): Promise<void>;
    googleAuth(req: Request, res: Response): Promise<void>;
    githubAuth(req: Request, res: Response): Promise<void>;
    changePassword(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): Promise<void>;
}