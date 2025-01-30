import { FileType, RecruiterProfileType } from "../../Types/types";

export interface IRecruiterService {
  getProfile(userId: string): Promise<RecruiterProfileType | null>;
  updateProfile(
    userId: string,
    data: Partial<RecruiterProfileType>,
    profilePicture: FileType | undefined
  ): Promise<RecruiterProfileType>;
}
