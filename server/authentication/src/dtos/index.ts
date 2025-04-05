import { VerifyUser } from './user/verify-user.dto'

import { ProfileInfo } from './student/profile-info.dto'

import { ProfileInfo as RecruiterProfileInfo } from './recruiter/profile-info.dto'

import { GetStudents } from './admin/get-students.dto'
import { GetRecruiters } from './admin/get-recruiters.dto'

export const UserDTO = {
    VerifyUser,
}

export const StudentDTO = {
    ProfileInfo,
}

export const RecruiterDTO = {
    ProfileInfo: RecruiterProfileInfo,
}

export const AdminDTO = {
    GetStudents,
    GetRecruiters,
}
