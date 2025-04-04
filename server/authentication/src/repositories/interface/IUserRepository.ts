import { IBaseRepository } from '@shreedev44/enigma-shared'
import { RecruiterWithProfileType, StudentWithProfileType, UserType } from '@types'

export interface IUserRepository extends IBaseRepository<UserType> {
    create(user: Partial<UserType>): Promise<UserType>
    findByEmail(email: string): Promise<UserType | null>
    findById(id: string): Promise<UserType | null>
    updateById(id: string, data: Partial<UserType>): Promise<UserType | null>
    getStudentWithProfile(
        sort: Record<string, number>,
        filter: Record<string, string>
    ): Promise<StudentWithProfileType[]>
    getRecruiterWithProfile(
        sort: Record<string, number>,
        filter: Record<string, string>
    ): Promise<RecruiterWithProfileType[]>
    blockUserById(id: string): Promise<boolean>
    unBlockUserById(id: string): Promise<boolean>
}
