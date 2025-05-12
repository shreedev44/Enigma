import { IInterviewSchema } from '@entities'

export interface IInterviewService {
    createInterview(
        userId: string,
        meetingTime: Date,
        candidateEmail: string,
        jobId: string,
        applicationId: string
    ): Promise<string>
    getAllInterviews(userId: string): Promise<IInterviewSchema[]>
}
