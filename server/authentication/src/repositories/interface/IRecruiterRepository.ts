import { RecruiterProfileType } from '@types'

export interface IRecruiterRepository {
    create(user: RecruiterProfileType): Promise<RecruiterProfileType>
    findByUserId(userId: string): Promise<RecruiterProfileType>
    updateById(userId: string, data: Partial<RecruiterProfileType>): Promise<RecruiterProfileType | null>
    findPicById(userId: string): Promise<string | undefined>
}
