import { _HttpStatus, Messages } from '@constants'
import { FileType, StudentProfileType } from '@types'
import { IStudentService } from '@services/interface'
import { IStudentRepository } from '@repositories/interface'
import { handleCloudinaryDelete, handleCloudinaryUpload, createHttpError } from '@utils'
import { StudentDTO } from '@dtos'

export class StudentService implements IStudentService {
    constructor(private _studentRepository: IStudentRepository) {}

    async getProfile(userId: string): Promise<InstanceType<typeof StudentDTO.ProfileInfo>> {
        const profile = await this._studentRepository.findByUserId(userId)

        if (!profile) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.NO_PROFILE)
        }
        return new StudentDTO.ProfileInfo(profile)
    }

    async updateProfile(
        userId: string,
        data: Partial<StudentProfileType>,
        profilePicture: FileType | undefined
    ): Promise<InstanceType<typeof StudentDTO.ProfileInfo>> {
        if (profilePicture) {
            const imageUrl = await handleCloudinaryUpload(profilePicture.buffer)
            data.profilePicture = imageUrl
            const url = await this._studentRepository.findPicById(userId)
            if (url && url.split('/')[2] === 'res.cloudinary.com') {
                await handleCloudinaryDelete(url)
            }
        }

        const profile = await this._studentRepository.updateById(userId, data)

        if (!profile) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.NO_PROFILE)
        }
        return new StudentDTO.ProfileInfo(profile)
    }
}
