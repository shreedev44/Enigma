import { Request, Response } from "express";

export interface IStudentController {
    getProfile(req: Request, res: Response): Promise<void>;
}