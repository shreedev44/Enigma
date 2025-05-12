import { IInterviewService } from '@services/interface'
import {
    IApplicationRepository,
    IInterviewRepository,
    IJobRepository,
    ISubscriptionRepository,
} from '@repositories/interface'
import { IInterviewSchema } from '@entities'
import { createHttpError, generateUID } from '@utils'
import { _HttpStatus, Messages } from '@constants'
import { Types } from 'mongoose'
import { interviewScheduledEvent } from '@producers'

export class InterviewService implements IInterviewService {
    constructor(
        private _interviewRepository: IInterviewRepository,
        private _applicationRepository: IApplicationRepository,
        private _jobRepository: IJobRepository,
        private _subscriptionRepository: ISubscriptionRepository
    ) {}

    async createInterview(
        userId: string,
        meetingTime: Date,
        candidateEmail: string,
        jobId: string,
        applicationId: string
    ): Promise<string> {
        const subscriptions = await this._subscriptionRepository.findAllWithEarlyDate(new Types.ObjectId(userId))
        const { totalMaxInterviews, earliestStartDate } = subscriptions[0]
        const eligible = await this._interviewRepository.canConductInterview(
            new Types.ObjectId(userId),
            earliestStartDate,
            totalMaxInterviews
        )

        if (!eligible) {
            throw createHttpError(_HttpStatus.BAD_REQUEST, Messages.LIMIT_REACHED)
        }

        const meetingId = await generateUID(10)

        const obj: Partial<IInterviewSchema> = {
            meetingId,
            meetingTime,
            userId: new Types.ObjectId(userId),
        }
        if (candidateEmail) {
            obj.candidateEmail = candidateEmail
            obj.applicationId = new Types.ObjectId(applicationId)
        }

        const interview = await this._interviewRepository.create(obj)

        if (!interview) {
            throw createHttpError(_HttpStatus.INTERNAL_SERVER_ERROR, Messages.SERVER_ERROR)
        }

        if (applicationId) {
            await this._applicationRepository.changeStatusById(new Types.ObjectId(applicationId), 'interview requested')
        }

        const application = await this._applicationRepository.findByEmail(candidateEmail)
        const job = await this._jobRepository.findByJobId(new Types.ObjectId(jobId))
        if (application && job) {
            const formattedMeetingTime = `${new Date(meetingTime).getDate().toString().padStart(2, '0')}/${(new Date(meetingTime).getMonth() + 1).toString().padStart(2, '0')}/${new Date(meetingTime).getFullYear()} ${new Date(meetingTime).getHours().toString().padStart(2, '0')}:${new Date(meetingTime).getMinutes().toString().padStart(2, '0')}`

            await interviewScheduledEvent({
                email: candidateEmail,
                fullName: application.name,
                jobTitle: `${job.role} at ${job?.companyName}`,
                meetingId,
                meetingTime: formattedMeetingTime,
            })
        }
        return interview.meetingId
    }

    async getAllInterviews(userId: string): Promise<IInterviewSchema[]> {
        const interviews = await this._interviewRepository.findAllByUserId(new Types.ObjectId(userId))

        return interviews
    }

    async getTotalInterviews(userId: string): Promise<number> {
        const count = await this._interviewRepository.totalInterviewsById(new Types.ObjectId(userId))
        return count
    }
}
