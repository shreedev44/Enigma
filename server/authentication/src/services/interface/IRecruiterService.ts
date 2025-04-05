import { RecruiterDTO } from '@dtos'
import { FileType, RecruiterProfileType } from '@types'

export interface IRecruiterService {
    getProfile(userId: string): Promise<InstanceType<typeof RecruiterDTO.ProfileInfo>>
    updateProfile(
        userId: string,
        data: Partial<RecruiterProfileType>,
        profilePicture: FileType | undefined
    ): Promise<InstanceType<typeof RecruiterDTO.ProfileInfo>>
}
