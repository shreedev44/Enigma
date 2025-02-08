import {
  RecruiterWithProfileType,
  StudentWithProfileType,
} from "../../Types/types";

export interface IAdminService {
  getStudents(
    page: number,
    sortBy: string,
    sortOrder: number,
    filter: string | null
  ): Promise<{ students: StudentWithProfileType[]; totalPages: number }>;
  getRecruiters(
    page: number,
    sortBy: string,
    sortOrder: number,
    filter: string | null
  ): Promise<{ recruiters: RecruiterWithProfileType[]; totalPages: number }>;
  blockOrUnblockUser(userId: string, block: boolean): Promise<boolean>;
}
