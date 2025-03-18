import { HttpStatus, Messages } from "@constants";
import { FileType, RecruiterProfileType } from "@types";
import { IRecruiterService } from "@services/interface";
import { IRecruiterRepository } from "@repositories/interface";
import {
  handleCloudinaryDelete,
  handleCloudinaryUpload,
  createHttpError,
} from "@utils";

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
      const imageUrl = await handleCloudinaryUpload(profilePicture.buffer);
      data.profilePicture = imageUrl;
      const url = await this._recruiterRepository.findPicById(userId);
      if (url && url.split("/")[2] === "res.cloudinary.com") {
        await handleCloudinaryDelete(url);
      }
    }

    const profile = await this._recruiterRepository.updateById(userId, data);

    if (!profile) {
      throw createHttpError(HttpStatus.NOT_FOUND, Messages.NO_PROFILE);
    }
    return profile;
  }
}
