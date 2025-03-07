import { Request, Response, NextFunction } from "express";
import { IProblemService } from "../../../services/interface/IProblemService";
import { IProblemController } from "../interface/IProblemController";
import { ProblemType } from "../../../Types/types";
import { HttpStatus } from "../../../constants/status.constant";
import { Messages } from "../../../constants/message.constant";

export class ProblemController implements IProblemController {
  constructor(private _problemService: IProblemService) {}

  async addProblem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const problem: ProblemType = req.body;

      await this._problemService.addProblem(problem);
      res.status(HttpStatus.OK).json({ message: Messages.PROBLEM_ADDED });
    } catch (err) {
      next(err);
    }
  }

  async getProblems(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        page = 1,
        sortBy = "problemNo",
        sortOrder = 1,
        filter = "",
      } = req.query;
      const sortOptions = ["problemNo", "solved", "title", "difficulty"];
      if (isNaN(Number(page))) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: Messages.INVALID_PAGE });
        return;
      }
      if (!sortOptions.includes(String(sortBy))) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: Messages.INVALID_SORT_OPTION });
        return;
      }
      if (Number(sortOrder) !== 1 && Number(sortOrder) !== -1) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: Messages.INVALID_SORT_VALUE });
        return;
      }
      const { problems, totalPages } = await this._problemService.getProblems(
        Number(page),
        String(sortBy),
        Number(sortOrder) as 1 | -1,
        filter ? String(filter) : null
      );
      res.status(HttpStatus.OK).json({ problems: problems, totalPages });
    } catch (err) {
      next(err);
    }
  }

  async findProblem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { problemNo } = req.params;
      if (!problemNo || isNaN(Number(problemNo))) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: Messages.INVALID_PROBLEM_NO });
        return;
      }

      const problem = await this._problemService.findProblem(Number(problemNo));
      res.status(HttpStatus.OK).json({ problem });
    } catch (err) {
      next(err);
    }
  }
}
