import { IAdminService } from "@services/interface";
import { IUserRepository } from "@repositories/interface";
import {
  RecruiterWithProfileType,
  StudentWithProfileType,
} from "@types";

export class AdminService implements IAdminService {
  constructor(private _userRepository: IUserRepository) {}

  async getStudents(
    page: number,
    sortBy: string,
    sortOrder: number,
    filter: string | null
  ): Promise<{ students: StudentWithProfileType[]; totalPages: number }> {
    const sort = { [sortBy]: sortOrder };
    let query: any = { role: "student" };
    if (filter) {
      query = {
        $and: [
          {
            $or: [
              { firstName: { $regex: filter, $options: "i" } },
              { lastName: { $regex: filter, $options: "i" } },
              { email: { $regex: filter, $options: "i" } },
            ],
          },
          { role: "student" },
        ],
      };
    }
    const students = await this._userRepository.getStudentWithProfile(
      sort,
      query
    );

    const dataPerPage = 1;
    const totalPages = Math.ceil(students.length / dataPerPage);

    const startIndex = (page - 1) * dataPerPage;
    const endIndex = startIndex + dataPerPage;

    return { students: students.slice(startIndex, endIndex), totalPages };
  }

  async getRecruiters(
    page: number,
    sortBy: string,
    sortOrder: number,
    filter: string | null
  ): Promise<{ recruiters: RecruiterWithProfileType[]; totalPages: number }> {
    const sort = { [sortBy]: sortOrder };
    let query: any = { role: "recruiter" };
    if (filter) {
      query = {
        $and: [
          {
            $or: [
              { companyName: { $regex: filter, $options: "i" } },
              { email: { $regex: filter, $options: "i" } },
            ],
          },
          { role: "recruiter" },
        ],
      };
    }
    const recruiters = await this._userRepository.getRecruiterWithProfile(
      sort,
      query
    );

    const dataPerPage = 1;
    const totalPages = Math.ceil(recruiters.length / dataPerPage);

    const startIndex = (page - 1) * dataPerPage;
    const endIndex = startIndex + dataPerPage;

    return { recruiters: recruiters.slice(startIndex, endIndex), totalPages };
  }

  async blockOrUnblockUser(userId: string, block: boolean): Promise<boolean> {
    if (block) {
      const blocked = await this._userRepository.blockUserById(userId);
      if (blocked) return true;
      else return false;
    } else {
      const unBlocked = await this._userRepository.unBlockUserById(userId);
      if (unBlocked) return true;
      else return false;
    }
  }
}
