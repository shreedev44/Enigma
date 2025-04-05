/* eslint-disable @typescript-eslint/no-explicit-any */

export class GetRecruiters {
    recruiters: any[]
    totalPages: number

    constructor(returnObj: any) {
        this.totalPages = returnObj.totalPages
        this.recruiters = returnObj.recruiters.map((recruiter: any) => {
            const obj = {
                _id: recruiter._id,
                email: recruiter.email,
                role: recruiter.role,
                status: recruiter.status,
                createdAt: recruiter.createdAt,
                subscriptionType: recruiter.subscriptionType,
                companyName: recruiter.companyName,
                bio: recruiter.bio,
                basedAt: recruiter.basedAt,
                linkedinProfile: recruiter.linkedinProfile,
                facebookProfile: recruiter.facebookProfile,
                twitterProfile: recruiter.twitterProfile,
                profilePicture: recruiter.profilePicture,
            }
            return obj
        })
    }
}
