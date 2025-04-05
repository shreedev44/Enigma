/* eslint-disable @typescript-eslint/no-explicit-any */

export class ProfileInfo {
    companyName: string
    bio: string
    basedAt: string
    facebookProfile: string
    linkedinProfile: string
    twitterProifle: string
    profilePicture: string

    constructor(profile: any) {
        this.companyName = profile.companyName
        this.bio = profile.bio
        this.basedAt = profile.basedAt
        this.facebookProfile = profile.facebookProfile
        this.linkedinProfile = profile.linkedinProfile
        this.twitterProifle = profile.twitterProfile
        this.profilePicture = profile.profilePicture
    }
}
