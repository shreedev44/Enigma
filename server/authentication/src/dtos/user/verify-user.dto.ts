/* eslint-disable @typescript-eslint/no-explicit-any */

export class VerifyUser {
    accessToken: string
    refreshToken: string
    user: any
    profile?: any

    constructor(returnObj: any) {
        this.accessToken = returnObj.accessToken
        this.refreshToken = returnObj.refreshToken

        this.user = {}
        this.profile = {}

        this.user._id = returnObj?.user?._id
        this.user.name = returnObj.user.name
        this.user.email = returnObj.user.email
        this.user.role = returnObj.user.role
        this.user.subscriptionType = returnObj.user.subscriptionType
        if (returnObj?.profile?.firstName) {
            this.profile.firstName = returnObj.profile.firstName
            this.profile.lastName = returnObj.profile.lastName
            this.profile.githubProfile = returnObj.profile.githubProfile
            this.profile.linkedinProfile = returnObj.profile.linkedinProfile
            this.profile.profilePicture = returnObj.profile.profilePicture
            this.profile.userId = returnObj.profile.userId
            this.profile._id = returnObj.profile._id
            this.profile.skills = returnObj.profile.skills
        } else if (returnObj?.profile?.companyName) {
            this.profile.companyName = returnObj.profile.companyName
            this.profile.bio = returnObj.profile.bio
            this.profile.basedAt = returnObj.profile.basedAt
            this.profile.facebookProfile = returnObj.profile.facebookProfile
            this.profile.linkedinProfile = returnObj.profile.linkedinProfile
            this.profile.twitterProifle = returnObj.profile.twitterProfile
            this.profile.profilePicture = returnObj.profile.profilePicture
            this.profile.userId = returnObj.profile.userId
            this.profile._id = returnObj.profile._id
        } else {
            this.user.name = returnObj.user.name
        }
    }
}
