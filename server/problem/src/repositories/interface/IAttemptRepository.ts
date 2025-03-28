import { AttemptsPerDay, AttemptType, MakeOptional, ProfileStatType } from '@types'

export interface IAttemptRepository {
    create(
        attempt: MakeOptional<
            AttemptType,
            '_id' | 'createdAt' | 'updatedAt' | 'rejectedTestCase' | 'rejectionMessage' | 'status'
        >
    ): Promise<Omit<AttemptType, 'problemNo' | 'updatedAt' | 'userId'>>
    getAttemptsOfUser(
        userId: string,
        problemNo: number
    ): Promise<Pick<AttemptType, '_id' | 'createdAt' | 'language' | 'status'>[]>
    findAttemptById(attemptId: string): Promise<AttemptType | null>
    getProblemStats(userId: string): Promise<ProfileStatType | null>
    attemptsPerDay(userId: string): Promise<AttemptsPerDay[] | null>
}
