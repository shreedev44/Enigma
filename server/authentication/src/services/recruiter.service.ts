import { createHttpError } from "../utils/http-error.util";
import { HttpStatus } from "../constants/status.constant";
import { Messages } from "../constants/message.constant";
import { FileType, RecruiterProfileType } from "../Types/types";
import { IRecruiterService } from "../interfaces/recruiter/IRecruiterService";
import { IRecruiterRepository } from "../interfaces/recruiter/IRecruiterRepository";
import { hanldeCloudinaryUpload } from "../config/cloudinary.config";

export class RecruiterService implements IRecruiterService {
  constructor(private _recruiterRepository: IRecruiterRepository) {}

  async getProfile(userId: string): Promise<RecruiterProfileType | null> {
    const profile = await this._recruiterRepository.findByUserId(userId);

    if (!profile) {
      throw createHttpError(HttpStatus.NOT_FOUND, Messages.NO_PROFILE);
    }
    return profile;
  }

  async updateProfile(
    userId: string,
    data: Partial<RecruiterProfileType>,
    profilePicture: FileType | undefined
  ): Promise<RecruiterProfileType> {
    if (profilePicture) {
      const imageUrl = await hanldeCloudinaryUpload(profilePicture.buffer);
      data.profilePicture = imageUrl;
    }

    const profile = await this._recruiterRepository.updateById(userId, data);

    if (!profile) {
      throw createHttpError(HttpStatus.NOT_FOUND, Messages.NO_PROFILE);
    }
    return profile;
  }
}
