import { IBlacklistSchema } from '@entities'

export interface IBlacklistService {
    blackListApplicant(applicantId: string, recruiterId: string, applicantName: string): Promise<void>
    getBlacklistOfRecruiter(recruiterId: string): Promise<IBlacklistSchema[]>
    removeFromBlacklist(recruiterId: string, applicantId: string): Promise<void>
}
