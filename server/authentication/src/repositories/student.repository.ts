import Student from '../models/student-profile.model';
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

    async findByUserId(userId: string): Promise<StudentProfileType> {
        try {
            const user = await Student.findOne({userId})
            return user as StudentProfileType
        } catch (err) {
            console.error(err)
            throw new Error("Error finding profile by userId")
        }
    }

    async updateById(userId: string, data: Partial<StudentProfileType>): Promise<StudentProfileType | null> {
        try{
            await Student.updateOne({userId}, data)
            const user = Student.findOne({userId})
            return user;
        } catch (err) {
            console.error(err)
            throw new Error("Error updating student profile by userId")
        }
    }
}

export default new StudentRepository();