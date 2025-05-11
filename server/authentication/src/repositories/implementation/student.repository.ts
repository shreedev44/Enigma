import Student, { StudentDocument } from '@models/student-profile.model'
import { StudentProfileType } from '@types'
import { IStudentRepository } from '@repositories/interface'
import { BaseRepository } from '@shreedev44/enigma-shared'

class StudentRepository extends BaseRepository<StudentDocument> implements IStudentRepository {
    constructor() {
        super(Student)
    }
    async create(user: Partial<StudentDocument>): Promise<StudentDocument> {
        try {
            const studentProfile = await this.model.create(user)
            return studentProfile
        } catch (err) {
            console.error(err)
            throw new Error('Error creating profile')
        }
    }

    async findByUserId(userId: string): Promise<StudentDocument> {
        try {
            const user = await this.model.findOne({ userId })
            return user as StudentDocument
        } catch (err) {
            console.error(err)
            throw new Error('Error finding profile by userId')
        }
    }

    async updateById(userId: string, data: Partial<StudentProfileType>): Promise<StudentProfileType | null> {
        try {
            await this.model.updateOne({ userId }, data)
            const user = this.model.findOne({ userId })
            return user
        } catch (err) {
            console.error(err)
            throw new Error('Error updating student profile by userId')
        }
    }

    async findPicById(userId: string): Promise<string> {
        try {
            const user = await this.model.findOne({ userId })
            return user?.profilePicture as string
        } catch (err) {
            console.error(err)
            throw new Error('Error finding picture by userId')
        }
    }

    async updateSkillsByUserId(userId: string, skills: string[]): Promise<boolean> {
        try {
            const result = await this.model.updateOne({ userId }, { skills })
            return result.modifiedCount > 0
        } catch (err) {
            console.error(err)
            throw new Error('Error updating skills')
        }
    }
}

export default new StudentRepository()
