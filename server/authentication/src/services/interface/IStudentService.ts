import { StudentDTO } from '@dtos'
import { FileType, StudentProfileType } from '@types'

export interface IStudentService {
    getProfile(userId: string): Promise<InstanceType<typeof StudentDTO.ProfileInfo>>
    updateProfile(
        userId: string,
        data: Partial<StudentProfileType>,
        profilePicture: FileType | undefined
    ): Promise<InstanceType<typeof StudentDTO.ProfileInfo>>
    updateSkills(userId: string, skills: string[]): Promise<void>
}
