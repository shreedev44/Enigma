/* eslint-disable @typescript-eslint/no-explicit-any */

export class TopThree {
    leaderboard: {
        userId: string
        username: string
        rank: number
    }[]

    constructor(returnObject: any) {
        this.leaderboard = returnObject.leaderboard.map((leaderboard: any) => {
            return {
                userId: leaderboard.userId,
                username: leaderboard.username,
                rank: leaderboard.rank,
            }
        })
    }
}
