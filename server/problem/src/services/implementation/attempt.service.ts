import { _HttpStatus, Messages, testFunctions } from '@constants'
import { IAttemptRepository, IProblemRepository } from '@repositories/interface'
import { IAttemptService } from '@services/interface'
import { Language, AttemptType, MakeOptional, ProfileStatType, AttemptsPerDay } from '@types'
import { createHttpError, executeCode } from '@utils'

export class AttemptService implements IAttemptService {
    constructor(
        private _attemptRepository: IAttemptRepository,
        private _problemRepository: IProblemRepository
    ) {}

    async submitSolution(
        problemNo: number,
        userId: string,
        solution: string,
        language: Language
    ): Promise<Omit<AttemptType, 'problemNo' | 'updatedAt' | 'userId'>> {
        const problem = await this._problemRepository.findProblemByNo(problemNo)

        if (!problem) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.PROBLEM_NOT_FOUND)
        }

        const ouptut = await executeCode(
            language,
            testFunctions[language as Exclude<Language, 'cpp'>](problem?.testCases, solution, problem?.functionName)
        )

        const attempt: MakeOptional<
            AttemptType,
            '_id' | 'createdAt' | 'updatedAt' | 'rejectedTestCase' | 'rejectionMessage' | 'status'
        > = {
            language,
            memory: ouptut.stats.memoryUsage,
            runTime: ouptut.stats.executionTime,
            problemNo,
            solution,
            userId,
            testCasePassed: 0,
        }
        try {
            let evalaution = { allPassed: true, index: -1, expected: '', ouptut: '' }
            const parsedResult = JSON.parse(ouptut.stdout)
            for (let i = 0; i < parsedResult.result.length; i++) {
                if (!parsedResult.result[i]) {
                    evalaution = {
                        allPassed: false,
                        index: i,
                        expected: parsedResult.expected[i],
                        ouptut: parsedResult.output[i],
                    }
                    break
                }
            }

            if (evalaution.allPassed) {
                attempt.status = 'Accepted'
                attempt.testCasePassed = problem.testCases.length
            } else {
                attempt.status = 'Rejected'
                attempt.rejectedTestCase = {
                    expected: evalaution.expected,
                    output: evalaution.ouptut,
                }
                attempt.rejectionMessage = Messages.FAILED_TESTCASE
                attempt.testCasePassed = evalaution.index
            }
        } catch (_err) {
            attempt.rejectionMessage = ouptut.stdout || ouptut.stderr
            attempt.status = 'Compile Error'
            attempt.testCasePassed = 0
        }
        return await this._attemptRepository.create(attempt)
    }

    async getAttempts(
        userId: string,
        problemNo: number
    ): Promise<Pick<AttemptType, '_id' | 'createdAt' | 'language' | 'status'>[]> {
        return await this._attemptRepository.getAttemptsOfUser(userId, problemNo)
    }

    async findAttempt(attemptId: string): Promise<AttemptType> {
        const attempt = await this._attemptRepository.findAttemptById(attemptId)

        if (!attempt) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.ATTEMPT_NOT_FOUND)
        }
        return attempt
    }

    async getProfileStats(userId: string): Promise<ProfileStatType> {
        const stats = await this._attemptRepository.getProblemStats(userId)

        if (!stats) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.STATS_NOT_RETRIEVED)
        }
        return stats
    }

    async getAttemptsPerDay(userId: string): Promise<AttemptsPerDay[]> {
        const attemptsPerDay = await this._attemptRepository.attemptsPerDay(userId)

        if (!attemptsPerDay) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.ATTENDANCE_NOT_RETRIEVED)
        }
        return attemptsPerDay
    }
}
