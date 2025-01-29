import { StudentProfileType } from "../../Types/types";

export interface IStudentRepository {
    create(user: StudentProfileType): Promise<StudentProfileType>;
    findByUserId(userId: string): Promise<StudentProfileType>;
    updateById(userId: string, data: Partial<StudentProfileType>): Promise<StudentProfileType | null>;
}