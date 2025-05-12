import { IBlacklistSchema } from '@entities'
import { BaseRepository } from '@shreedev44/enigma-shared'
import { IBlacklistRepository } from '../interface/IBlacklistRepository'
import Blacklist from '@models/blacklist.model'
import { Types } from 'mongoose'

export class BlacklistRepository extends BaseRepository<IBlacklistSchema> implements IBlacklistRepository {
    constructor() {
        super(Blacklist)
    }

    async getBlacklistedApplicant(
        recruiterId: Types.ObjectId,
        applicantId: Types.ObjectId
    ): Promise<IBlacklistSchema | null> {
        try {
            const applicant = await this.model.findOne({ recruiterId, applicantId })
            return applicant
        } catch (err) {
            console.error(err)
            throw new Error('Error while getting blacklisted applicant')
        }
    }

    async getBlacklistByRecruiterId(recruiterId: Types.ObjectId): Promise<IBlacklistSchema[]> {
        try {
            const applicants = await this.model.find({ recruiterId })
            return applicants
        } catch (err) {
            console.error(err)
            throw new Error('Error while getting blacklist of a recruiter')
        }
    }

    async deleteBlacklist(recruiterId: Types.ObjectId, applicantId: Types.ObjectId): Promise<boolean> {
        try {
            const result = await this.model.deleteOne({ recruiterId, applicantId })
            return result.deletedCount > 0
        } catch (err) {
            console.error(err)
            throw new Error('Error while deleting applicant from blacklist')
        }
    }
}

export default new BlacklistRepository()
