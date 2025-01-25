import { HttpStatus } from "../../constants/StatusConstants";
import { HttpError } from "../../utils/HttpError";
import { Messages } from "../../constants/MessageConstants";
import { Request, Response } from "express";
import { IStudentService } from "../../interfaces/student/IStudentService";
import { IStudentController } from "../../interfaces/student/IStudentController";
import { StudentProfileType } from "../../Types/types";

export class StudentController implements IStudentController {
  constructor(private _studentService: IStudentService) {}

  async getProfile(req: Request, res: Response): Promise<void> {
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
      if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: Messages.SERVER_ERROR });
        console.log(err);
      }
    }
  }
}
