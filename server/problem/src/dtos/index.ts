import { AttemptInfo } from './attempts/attempt-info.dto'
import { GetAttempts } from './attempts/get-attempts.dto'
import { ProfileStats } from './attempts/profile-stats.dto'
import { AttemptsAttendance } from './attempts/attempts-per-day.dto'

import { GetProblems } from './problems/get-problems.dto'
import { ProblemInfo } from './problems/problem-info.dto'
import { Compile } from './problems/compile.dto'

import { LeaderboardInfo } from './leaderboard/leaderboard-info.dto'

export const AttemptDTO = {
    AttemptInfo,
    GetAttempts,
    ProfileStats,
    AttemptsAttendance,
}

export const ProblemDTO = {
    GetProblems,
    ProblemInfo,
    Compile,
}

export const LeaderboardDTO = {
    LeaderboardInfo,
}
