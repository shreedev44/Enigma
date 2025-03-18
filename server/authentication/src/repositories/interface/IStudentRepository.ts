import { StudentProfileType } from '@types'

export interface IStudentRepository {
    create(user: StudentProfileType): Promise<StudentProfileType>
    findByUserId(userId: string): Promise<StudentProfileType>
    updateById(userId: string, data: Partial<StudentProfileType>): Promise<StudentProfileType | null>
    findPicById(userId: string): Promise<string | undefined>
}
