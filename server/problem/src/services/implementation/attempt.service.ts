import { _HttpStatus, Messages, testFunctions } from '@constants'
import { IAttemptRepository, ILeaderboardRepository, IProblemRepository } from '@repositories/interface'
import { IAttemptService } from '@services/interface'
import { Language, AttemptType } from '@types'
import { createHttpError, executeCode } from '@utils'
import { AttemptDTO } from '@dtos'

export class AttemptService implements IAttemptService {
    constructor(
        private _attemptRepository: IAttemptRepository,
        private _problemRepository: IProblemRepository,
        private _leaderboardRepository: ILeaderboardRepository
    ) {}

    async submitSolution(
        problemNo: number,
        userId: string,
        solution: string,
        language: Language
    ): Promise<InstanceType<typeof AttemptDTO.AttemptInfo>> {
        const problem = await this._problemRepository.findProblemByNo(problemNo, 'student')

        if (!problem) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.PROBLEM_NOT_FOUND)
        }

        const ouptut = await executeCode(
            language,
            testFunctions[language as Exclude<Language, 'cpp'>](problem?.testCases, solution, problem?.functionName)
        )

        const attempt: Partial<AttemptType> = {
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
                const solved = await this._attemptRepository.isSolved(userId, problemNo)
                if (!solved) {
                    await this._leaderboardRepository.problemSolved(userId, problem.difficulty.toLowerCase())
                }
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
        const attemptData = await this._attemptRepository.create(attempt)
        return new AttemptDTO.AttemptInfo(attemptData)
    }

    async getAttempts(userId: string, problemNo: number): Promise<InstanceType<typeof AttemptDTO.GetAttempts>[]> {
        const attempts = await this._attemptRepository.getAttemptsOfUser(userId, problemNo)
        return attempts.map((attempt) => new AttemptDTO.GetAttempts(attempt))
    }

    async findAttempt(attemptId: string): Promise<InstanceType<typeof AttemptDTO.AttemptInfo>> {
        const attempt = await this._attemptRepository.findAttemptById(attemptId)

        if (!attempt) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.ATTEMPT_NOT_FOUND)
        }
        return new AttemptDTO.AttemptInfo(attempt)
    }

    async getProfileStats(userId: string): Promise<InstanceType<typeof AttemptDTO.ProfileStats>> {
        const stats = await this._attemptRepository.getProblemStats(userId)
        const totalProblemsExist = await this._problemRepository.countDocuments()

        if (!stats) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.STATS_NOT_RETRIEVED)
        }
        return new AttemptDTO.ProfileStats({ ...stats, totalProblemsExist })
    }

    async getAttemptsPerDay(userId: string): Promise<InstanceType<typeof AttemptDTO.AttemptsAttendance>[]> {
        const attemptsPerDay = await this._attemptRepository.attemptsPerDay(userId)

        if (!attemptsPerDay) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.ATTENDANCE_NOT_RETRIEVED)
        }
        return attemptsPerDay.map((attempt) => new AttemptDTO.AttemptsAttendance(attempt))
    }

    async getStats(): Promise<{
        totalAttempts: number
        attemptsPerDay: number
        acceptanceRate: number
        attemptsByDate: { date: string; count: number }[]
    }> {
        const stats = await this._attemptRepository.getStats()

        return stats
    }
}
