import { IBlacklistService } from '@services/interface'
import { IBlacklistRepository } from '@repositories/interface'
import { Types } from 'mongoose'
import { createHttpError } from '@utils'
import { _HttpStatus, Messages } from '@constants'
import { IBlacklistSchema } from '@entities'

export class BlacklistService implements IBlacklistService {
    constructor(private _blacklistRepository: IBlacklistRepository) {}

    async blackListApplicant(applicantId: string, recruiterId: string, applicantName: string): Promise<void> {
        const alreadyBlacklisted = await this._blacklistRepository.getBlacklistedApplicant(
            new Types.ObjectId(recruiterId),
            new Types.ObjectId(applicantId)
        )

        if (alreadyBlacklisted) {
            throw createHttpError(_HttpStatus.CONFLICT, Messages.ALREADY_BLACKLISTED)
        }

        await this._blacklistRepository.create({
            applicantId: new Types.ObjectId(applicantId),
            recruiterId: new Types.ObjectId(recruiterId),
            applicantName,
        })
    }

    async getBlacklistOfRecruiter(recruiterId: string): Promise<IBlacklistSchema[]> {
        const applicants = await this._blacklistRepository.getBlacklistByRecruiterId(new Types.ObjectId(recruiterId))
        return applicants
    }

    async removeFromBlacklist(recruiterId: string, applicantId: string): Promise<void> {
        const removed = await this._blacklistRepository.deleteBlacklist(
            new Types.ObjectId(recruiterId),
            new Types.ObjectId(applicantId)
        )

        if (!removed) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.APPLICANT_NOT_FOUND)
        }
    }
}
