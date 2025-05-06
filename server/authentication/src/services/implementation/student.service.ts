import { _HttpStatus, Messages } from '@constants'
import { FileType, StudentProfileType } from '@types'
import { IStudentService } from '@services/interface'
import { IStudentRepository } from '@repositories/interface'
import { handleCloudinaryDelete, handleCloudinaryUpload, createHttpError } from '@utils'
import { StudentDTO } from '@dtos'
import { sendUserUpdationEvent } from '@producers'

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
        const obj: { username?: string; profilePicture?: string } = {}
        if (profilePicture) {
            const imageUrl = await handleCloudinaryUpload(profilePicture.buffer)
            data.profilePicture = imageUrl
            const url = await this._studentRepository.findPicById(userId)
            if (url && url.split('/')[2] === 'res.cloudinary.com') {
                await handleCloudinaryDelete(url)
            }
            obj.profilePicture = imageUrl
        }

        const profile = await this._studentRepository.updateById(userId, data)

        if (!profile) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.NO_PROFILE)
        }

        if (data.firstName || data.lastName) {
            obj.username = `${profile?.firstName} ${profile?.lastName}`
        }

        if (obj.profilePicture || obj.username) {
            sendUserUpdationEvent({ ...obj, userId: String(profile.userId) })
        }

        return new StudentDTO.ProfileInfo(profile)
    }
}
