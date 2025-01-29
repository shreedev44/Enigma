import { FileType, StudentProfileType } from "../../Types/types";

export interface IStudentService {
  getProfile(userId: string): Promise<StudentProfileType>;
  updateProfile(
    userId: string,
    data: Partial<StudentProfileType>,
    profilePicture: FileType | undefined
  ): Promise<StudentProfileType>;
}
