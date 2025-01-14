import Student from '../models/StudentProfileSchema';
import { StudentProfileType } from '../Types/types';
import { IStudentRepository } from '../interfaces/student/IStudentRepository';

class StudentRepository implements IStudentRepository{
    async create(user: StudentProfileType): Promise<StudentProfileType> {
        try{
            const studentProfile = await Student.create(user)
            return studentProfile
        } catch(err) {
            console.error(err)
            throw new Error("Error creating profile")
        }
    }

    async findByUserId(userId: string): Promise<StudentProfileType | null> {
        try {
            const user = await Student.findOne({userId})
            return user
        } catch (err) {
            console.error(err)
            throw new Error("Error finding profile by userId")
        }
    }
}

export default new StudentRepository();