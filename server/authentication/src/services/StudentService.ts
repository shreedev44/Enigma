import { createHttpError } from "../utils/HttpError";
import { HttpStatus } from "../constants/StatusConstants";
import { Messages } from "../constants/MessageConstants";
import { FileType, StudentProfileType } from "../Types/types";
import { IStudentService } from "../interfaces/student/IStudentService";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { hanldeCloudinaryUpload } from "../config/Cloudinary";

export class StudentService implements IStudentService {
    constructor(private _studentRepository: IStudentRepository){}

    async getProfile(userId: string): Promise<StudentProfileType> {
        const profile = await this._studentRepository.findByUserId(userId)
        
        if(!profile) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.NO_PROFILE)
        }
        return profile
    }

    async updateProfile(userId: string, data: Partial<StudentProfileType>, profilePicture: FileType | undefined): Promise<StudentProfileType> {
        if(profilePicture) {
            const imageUrl = await hanldeCloudinaryUpload(profilePicture.buffer)
            data.profilePicture = imageUrl
        }

        const profile = await this._studentRepository.updateById(userId, data)

        if(!profile) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.NO_PROFILE)
        }
        return profile
    }
}