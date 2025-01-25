import { createHttpError } from "../utils/HttpError";
import { HttpStatus } from "../constants/StatusConstants";
import { Messages } from "../constants/MessageConstants";
import { StudentProfileType } from "../Types/types";
import { IStudentService } from "../interfaces/student/IStudentService";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";

export class StudentService implements IStudentService {
    constructor(private _studentRepository: IStudentRepository){}

    async getProfile(userId: string): Promise<StudentProfileType> {
        const profile = await this._studentRepository.findByUserId(userId)
        
        if(!profile) {
            throw createHttpError(HttpStatus.NOT_FOUND, Messages.NO_PROFILE)
        }
        return profile
    }
}