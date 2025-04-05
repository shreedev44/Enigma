import { IBaseRepository } from '@shreedev44/enigma-shared'
import { StudentProfileType } from '@types'

export interface IStudentRepository extends IBaseRepository<StudentProfileType> {
    create(user: Partial<StudentProfileType>): Promise<StudentProfileType>
    findByUserId(userId: string): Promise<StudentProfileType>
    updateById(userId: string, data: Partial<StudentProfileType>): Promise<StudentProfileType | null>
    findPicById(userId: string): Promise<string | undefined>
}
