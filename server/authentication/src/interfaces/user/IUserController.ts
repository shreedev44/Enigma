import { Request, Response } from "express";

export interface IUserController {
    register(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
    verifyUser(req: Request, res: Response): Promise<void>;
}