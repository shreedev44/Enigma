import User from "../models/UserSchema";
import {
  RecruiterWithProfileType,
  StudentWithProfileType,
  UserType,
} from "../Types/types";
import { IUserRepository } from "../interfaces/user/IUserRepository";

class UserRepository implements IUserRepository {
  async create(user: UserType): Promise<UserType> {
    try {
      const userData = await User.create(user);
      return userData;
    } catch (err) {
      console.error(err);
      throw new Error("Error creating user");
    }
  }

  async findByEmail(email: string): Promise<UserType | null> {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (err) {
      console.error(err);
      throw new Error("Error finding user by email");
    }
  }

  async findById(id: string): Promise<UserType | null> {
    try {
      const user = await User.findById(id);
      return user;
    } catch (err) {
      console.error(err);
      throw new Error("Error finding user by id");
    }
  }

  async updateById(
    id: string,
    data: Partial<UserType>
  ): Promise<UserType | null> {
    try {
      const user = await User.findByIdAndUpdate(id, data);
      return user;
    } catch (err) {
      console.log(err);
      throw new Error("Error updating user by id");
    }
  }

  async getStudentWithProfile(
    sort: Record<string, 1 | -1>,
    filter: Record<string, string>
  ): Promise<StudentWithProfileType[]> {
    try {
      const users = await User.aggregate([
        {
          $lookup: {
            from: "StudentProfiles",
            localField: "_id",
            foreignField: "userId",
            as: "profile",
          },
        },
        { $unwind: "$profile" },
        {
          $project: {
            _id: 1,
            email: 1,
            role: 1,
            status: 1,
            createdAt: 1,
            firstName: "$profile.firstName",
            lastName: "$profile.lastName",
            githubProfile: "$profile.githubProfile",
            linkedinProfile: "$profile.linkedinProfile",
            profilePicture: "$profile.profilePicture",
          },
        },
        { $match: filter },
        { $sort: sort },
      ]);

      return users;
    } catch (err) {
      console.log(err);
      throw new Error("Error feching students");
    }
  }

  async getRecruiterWithProfile(
    sort: Record<string, 1 | -1>,
    filter: Record<string, string>
  ): Promise<RecruiterWithProfileType[]> {
    try {
      const users = await User.aggregate([
        {
          $lookup: {
            from: "RecruiterProfiles",
            localField: "_id",
            foreignField: "userId",
            as: "profile",
          },
        },
        { $unwind: "$profile" },
        {
          $project: {
            _id: 1,
            email: 1,
            role: 1,
            status: 1,
            createdAt: 1,
            subscriptionType: 1,
            companyName: "$profile.companyName",
            bio: "$profile.bio",
            basedAt: "$profile.basedAt",
            linkedinProfile: "$profile.linkedinProfile",
            facebookProfile: "$profile.facebookProfile",
            twitterProfile: "$profile.twitterProfile",
            profilePicture: "$profile.profilePicture",
          },
        },
        { $match: filter },
        { $sort: sort },
      ]);

      return users;
    } catch (err) {
      console.log(err);
      throw new Error("Error fetching recruiters");
    }
  }

  async blockUserById(id: string): Promise<boolean> {
    try {
      const user = await User.findByIdAndUpdate(id, {status: 'blocked'})
      if(user) return true;
      return false;
    } catch (err) {
      console.log(err);
      throw new Error("Error blocking user");
    }
  }

  async unBlockUserById(id: string): Promise<boolean> {
    try {
      const user = await User.findByIdAndUpdate(id, {status: "active"})
      if(user) return true;
      return false
    } catch (err) {
      console.log(err)
      throw new Error("Error unblocking user");
    }
  }
}

export default new UserRepository();
