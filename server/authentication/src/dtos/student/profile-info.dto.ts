/* eslint-disable @typescript-eslint/no-explicit-any */

export class ProfileInfo {
    firstName: string
    lastName: string
    githubProfile: string
    linkedinProfile: string
    profilePicture: string
    skills: string

    constructor(profile: any) {
        this.firstName = profile.firstName
        this.lastName = profile.lastName
        this.githubProfile = profile.githubProfile
        this.linkedinProfile = profile.linkedinProfile
        this.profilePicture = profile.profilePicture
        this.skills = profile.skills
    }
}
