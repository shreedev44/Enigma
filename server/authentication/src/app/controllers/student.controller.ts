import { HttpStatus } from "../../constants/status.constant";
import { Messages } from "../../constants/message.constant";
import { NextFunction, Request, Response } from "express";
import { IStudentService } from "../../interfaces/student/IStudentService";
import { IStudentController } from "../../interfaces/student/IStudentController";
import { FileType, StudentProfileType } from "../../Types/types";

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
