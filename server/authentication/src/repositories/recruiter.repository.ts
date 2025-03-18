import Recruiter from "../models/recruiter.model";
import { RecruiterProfileType } from "../Types/types";
import { IRecruiterRepository } from "../interfaces/recruiter/IRecruiterRepository";

class RecruiterRepository implements IRecruiterRepository {
  async create(user: RecruiterProfileType): Promise<RecruiterProfileType> {
    try {
      const userData = await Recruiter.create(user);
      return userData;
    } catch (err) {
      console.log(err);
      throw new Error("Error creating user");
    }
  }

  async findByUserId(userId: string): Promise<RecruiterProfileType> {
    try {
      const user = await Recruiter.findOne({ userId });
      return user as RecruiterProfileType;
    } catch (err) {
      console.log(err);
      throw new Error("Error finding profile by userId");
    }
  }

  async updateById(
    userId: string,
    data: Partial<RecruiterProfileType>
  ): Promise<RecruiterProfileType | null> {
    try {
      await Recruiter.updateOne({ userId }, data);
      const profile = Recruiter.findOne({ userId });
      return profile;
    } catch (err) {
      console.log(err);
      throw new Error("Error updating recruiter profile by userId");
    }
  }

  async findPicById(userId: string): Promise<string | undefined> {
    try {
      const user = await Recruiter.findOne({ userId });
      return user?.profilePicture;
    } catch (err) {
      console.log(err);
      throw new Error("Error finding recruiter profile pic by userId");
    }
  }
}

export default new RecruiterRepository();
