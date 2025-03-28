import { AttemptsPerDay, AttemptType, Language, ProfileStatType } from '@types'

export interface IAttemptService {
    submitSolution(
        problemNo: number,
        userId: string,
        solution: string,
        language: Language
    ): Promise<Omit<AttemptType, 'problemNo' | 'updatedAt' | 'userId'>>
    getAttempts(
        userId: string,
        problemNo: number
    ): Promise<Pick<AttemptType, '_id' | 'createdAt' | 'language' | 'status'>[]>
    findAttempt(attemptId: string): Promise<AttemptType>
    getProfileStats(userId: string): Promise<ProfileStatType>
    getAttemptsPerDay(userId: string): Promise<AttemptsPerDay[]>
}
