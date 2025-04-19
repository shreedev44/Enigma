/* eslint-disable @typescript-eslint/no-explicit-any */

export class LeaderboardInfo {
    leaderboard: {
        userId: string
        username: string
        profilePicture: string
        solved: {
            beginner: number
            intermediate: number
            advanced: number
        }
        rank: number
    }[]
    totalPages: number
    rank?: {
        userId: string
        username: string
        profilePicture: string
        solved: {
            beginner: number
            intermediate: number
            advanced: number
        }
        rank: number
    }

    constructor(returnObject: any) {
        this.leaderboard = returnObject.leaderboard.map((leaderboard: any) => {
            return {
                userId: leaderboard.userId,
                username: leaderboard.username,
                profilePicture: leaderboard.profilePicture,
                solved: leaderboard.solved,
                rank: leaderboard.rank,
            }
        })
        this.totalPages = returnObject.totalPages
        if (returnObject.rank) {
            this.rank = {
                userId: returnObject.rank.userId,
                username: returnObject.rank.username,
                profilePicture: returnObject.rank.profilePicture,
                solved: returnObject.rank.solved,
                rank: returnObject.rank.rank,
            }
        }
    }
}
