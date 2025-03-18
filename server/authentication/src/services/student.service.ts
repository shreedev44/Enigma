import { createHttpError } from "../utils/http-error.util";
import { HttpStatus } from "../constants/status.constant";
import { Messages } from "../constants/message.constant";
import { FileType, StudentProfileType } from "../Types/types";
import { IStudentService } from "../interfaces/student/IStudentService";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { handleCloudinaryDelete, handleCloudinaryUpload } from "../config/cloudinary.config";

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
            const imageUrl = await handleCloudinaryUpload(profilePicture.buffer)
            data.profilePicture = imageUrl
            const url = await this._studentRepository.findPicById(userId)
            if(url && url.split('/')[2] === "res.cloudinary.com") {
                await handleCloudinaryDelete(url)
            }
        }

        const profile = await this._studentRepository.updateById(userId, data)

        if(!profile) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.NO_PROFILE)
        }
        return profile
    }
}