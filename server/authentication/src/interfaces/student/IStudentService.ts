import { StudentProfileType } from "../../Types/types";

export interface IStudentService {
    getProfile(userId: string): Promise<StudentProfileType>;
}