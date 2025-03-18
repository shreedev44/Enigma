import { NextFunction, Request, Response } from "express";
import { HttpStatus, Messages } from "@constants"
import { IStudentService } from "@services/interface";
import { IStudentController } from "@controllers/interface";
import { FileType, StudentProfileType } from "@types";

export class StudentController implements IStudentController {
  constructor(private _studentService: IStudentService) {}

  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = JSON.parse(req.headers["x-user-payload"] as string);
      if (!id) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: Messages.INCOMPLETE_FORM });
        return;
      }
      const profile: StudentProfileType = await this._studentService.getProfile(
        id as string
      );
      res.status(HttpStatus.OK).json({ profile });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = req.body;
      const { id } = JSON.parse(req.headers["x-user-payload"] as string);
      const profilePicture = req.file;
      const profile = await this._studentService.updateProfile(
        id,
        userData,
        profilePicture as FileType | undefined
      );
      res.status(HttpStatus.OK).json({ profile });
    } catch (err) {
      next(err);
    }
  }
}
