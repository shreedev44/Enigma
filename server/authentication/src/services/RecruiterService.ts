import { createHttpError } from "../utils/HttpError";
import { HttpStatus } from "../constants/StatusConstants";
import { Messages } from "../constants/MessageConstants";
import { FileType, RecruiterProfileType } from "../Types/types";
import { IRecruiterService } from "../interfaces/recruiter/IRecruiterService";
import { IRecruiterRepository } from "../interfaces/recruiter/IRecruiterRepository";
import { hanldeCloudinaryUpload } from "../config/Cloudinary";

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
