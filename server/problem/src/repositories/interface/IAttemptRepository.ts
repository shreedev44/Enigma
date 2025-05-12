import { AttemptsPerDay, AttemptType, ProfileStatType } from '@types'
import { IBaseRepository } from '@shreedev44/enigma-shared'

export interface IAttemptRepository extends IBaseRepository<AttemptType> {
    create(attempt: Partial<AttemptType>): Promise<AttemptType>
    getAttemptsOfUser(
        userId: string,
        problemNo: number
    ): Promise<Pick<AttemptType, '_id' | 'createdAt' | 'language' | 'status'>[]>
    findAttemptById(attemptId: string): Promise<AttemptType | null>
    getProblemStats(userId: string): Promise<Omit<ProfileStatType, 'totalProblemsExist'> | null>
    attemptsPerDay(userId: string): Promise<AttemptsPerDay[] | null>
    isSolved(userId: string, problemNo: number): Promise<boolean>
    getStats(): Promise<{
        totalAttempts: number
        attemptsPerDay: number
        acceptanceRate: number
        attemptsByDate: { date: string; count: number }[]
    }>
}
