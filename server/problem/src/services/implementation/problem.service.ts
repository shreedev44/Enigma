import { createHttpError } from "../../utils/http-error.util";
import { HttpStatus } from "../../constants/status.constant";
import { Messages } from "../../constants/message.constant";
import { IProblemService } from "../interface/IProblemService";
import { IProblemRepository } from "../../repositories/interface/IProblemRepository";
import {
  Language,
  MakeOptional,
  ProblemListType,
  ProblemType,
  TestCaseType,
} from "../../Types/types";
import { executeCode } from "../../utils/executor.util";
import { generateConstraints } from "../../utils/generate-constraints.util";
import { getPrompt } from "../../utils/ai-prompt.util";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { basePrompt } from "../../constants/prompt.constant";
import { env } from "../../config/env.config";
import { testFunctions } from "../../constants/test-functions.constants";

export class ProblemService implements IProblemService {
  constructor(private _problemRepository: IProblemRepository) {}

  async addProblem(
    problem: MakeOptional<ProblemType, "testCases">
  ): Promise<void> {
    const problemExist = await this._problemRepository.findByTitle(
      problem.title
    );

    if (problemExist) {
      throw createHttpError(HttpStatus.CONFLICT, Messages.PROBLEM_TITLE_EXIST);
    }

    const prompt = getPrompt(
      problem.description,
      {
        functionReturnType: problem.functionReturnType,
        functionReturnElemType: problem.functionReturnElemType,
        functionReturnNestedType: problem.functionReturnNestedType,
      },
      problem.parameters
    );
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-pro-exp-02-05",
    });

    const result = await model.generateContent(basePrompt + "\n\n\n" + prompt);


    const testCases = JSON.parse(
      result.response.text().replace(/```json\n|\n```/g, "")
    );
    
    problem.testCases = testCases;
    problem.constraints = problem.parameters
    .map((parameter) => generateConstraints(parameter))
    .flat();
    const latest = await this._problemRepository.findLatestProblem();
    problem.problemNo = (latest?.problemNo || 0) + 1;
    
    await this._problemRepository.create(problem as ProblemType);
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

  async compileCode(
    code: string,
    language: Language
  ): Promise<{ stdout: string; stderr: string }> {
    const result = await executeCode(language, code);

    return result;
  }

  async runSolution(
    code: string,
    language: Language,
    problemNo: number
  ): Promise<{ stdout: string; stderr: string }> {
    const problem = await this._problemRepository.findProblemByNo(problemNo)
    if(!problem) {
      throw createHttpError(HttpStatus.NOT_FOUND, Messages.PROBLEM_NOT_FOUND);
    }
    const result = await executeCode(language, testFunctions[(language as Exclude<Language, "cpp">)](problem?.testCases, code, problem?.functionName))
    try {
      JSON.parse(result.stdout)
    } catch (err) {
      result.stderr = result.stdout
      result.stdout = ''
    }
    return result
  }
}
