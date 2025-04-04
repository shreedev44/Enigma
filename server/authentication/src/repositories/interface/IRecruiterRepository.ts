import { IBaseRepository } from '@shreedev44/enigma-shared'
import { RecruiterProfileType } from '@types'

export interface IRecruiterRepository extends IBaseRepository<RecruiterProfileType> {
    create(user: Partial<RecruiterProfileType>): Promise<RecruiterProfileType>
    findByUserId(userId: string): Promise<RecruiterProfileType>
    updateById(userId: string, data: Partial<RecruiterProfileType>): Promise<RecruiterProfileType | null>
    findPicById(userId: string): Promise<string | undefined>
}
