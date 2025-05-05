import { AttemptDTO } from '@dtos'
import { Language } from '@types'

export interface IAttemptService {
    submitSolution(
        problemNo: number,
        userId: string,
        solution: string,
        language: Language
    ): Promise<InstanceType<typeof AttemptDTO.AttemptInfo>>
    getAttempts(userId: string, problemNo: number): Promise<InstanceType<typeof AttemptDTO.GetAttempts>[]>
    findAttempt(attemptId: string): Promise<InstanceType<typeof AttemptDTO.AttemptInfo>>
    getProfileStats(userId: string): Promise<InstanceType<typeof AttemptDTO.ProfileStats>>
    getAttemptsPerDay(userId: string): Promise<InstanceType<typeof AttemptDTO.AttemptsAttendance>[]>
    getStats(): Promise<{ totalAttempts: number; attemptsPerDay: number; acceptanceRate: number }>
}
