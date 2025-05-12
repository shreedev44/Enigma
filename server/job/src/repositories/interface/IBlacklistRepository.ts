import { IBlacklistSchema } from '@entities'
import { IBaseRepository } from '@shreedev44/enigma-shared'
import { Types } from 'mongoose'

export interface IBlacklistRepository extends IBaseRepository<IBlacklistSchema> {
    getBlacklistByRecruiterId(recruiterId: Types.ObjectId): Promise<IBlacklistSchema[]>
    getBlacklistedApplicant(recruiterId: Types.ObjectId, applicantId: Types.ObjectId): Promise<IBlacklistSchema | null>
    deleteBlacklist(recruiterId: Types.ObjectId, applicantId: Types.ObjectId): Promise<boolean>
}
