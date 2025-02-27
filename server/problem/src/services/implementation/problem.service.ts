import { createHttpError } from "../../utils/http-error.util";
import { HttpStatus } from "../../constants/status.constant";
import { Messages } from "../../constants/message.constant";
import { IProblemService } from "../interface/IProblemService";
import { IProblemRepository } from "../../repositories/interface/IProblemRepository";
import { ProblemListType, ProblemType } from "../../Types/types";
import { validateTestCase } from "../../utils/validate-parameters.util";

export class ProblemService implements IProblemService {
  constructor(private _problemRepository: IProblemRepository) {}

  async addProblem(problem: ProblemType): Promise<void> {
    const problemExist = await this._problemRepository.findByTitle(
      problem.title
    );

    if (problemExist) {
      throw createHttpError(HttpStatus.CONFLICT, Messages.PROBLEM_TITLE_EXIST);
    }

    problem.testCases.forEach((testCase) => {
      if (!validateTestCase(testCase, problem.parameters)) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          Messages.DATATYPE_NOT_MATCHING
        );
      }
    });

    const latest = await this._problemRepository.findLatestProblem();
    problem.problemNo = (latest?.problemNo || 0) + 1;

    await this._problemRepository.create(problem);
  }

  async getProblems(
    page: number,
    sortBy: string,
    sortOrder: 1 | -1,
    filter: string | null
  ): Promise<{ problems: ProblemListType[]; totalPages: number }> {
    const sort = { [sortBy]: sortOrder };
    let query: any = { status: "listed" };
    if (filter) {
      query = {
        $and: [
          {
            $or: [
              { title: { $regex: filter, $options: "i" } },
              { problemNo: { $regex: filter, $options: "i" } },
              { difficulty: { $regex: filter, $options: "i" } },
            ],
          },
          { status: "listed" },
        ],
      };
    }

    const problems = await this._problemRepository.getProblems(sort, query);

    const dataPerPage = 1;
    const totalPages = Math.ceil(problems.length / dataPerPage);

    const startIndex = (page - 1) * dataPerPage;
    const endIndex = startIndex + dataPerPage;
    return { problems: problems.slice(startIndex, endIndex), totalPages };
  }

  async findProblem(problemNo: number): Promise<ProblemType> {
    const problem = await this._problemRepository.findProblemByNo(problemNo);

    if (!problem) {
      throw createHttpError(HttpStatus.NOT_FOUND, Messages.PROBLEM_NOT_FOUND);
    }

    return problem;
  }
}
