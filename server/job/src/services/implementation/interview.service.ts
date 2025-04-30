import { IInterviewService } from '@services/interface'
import { IInterviewRepository } from '@repositories/interface'
import { IInterviewSchema } from '@entities'
import { createHttpError, generateUID } from '@utils'
import { _HttpStatus, Messages } from '@constants'
import { Types } from 'mongoose'

export class InterviewService implements IInterviewService {
    constructor(private _interviewRepository: IInterviewRepository) {}

    async createInterview(userId: string, meetingTime: Date, candidateEmail: string): Promise<string> {
        const meetingId = await generateUID(10)

        const obj: Partial<IInterviewSchema> = {
            meetingId,
            meetingTime,
            userId: new Types.ObjectId(userId),
        }
        if (candidateEmail) {
            obj.candidateEmail = candidateEmail
        }

        const interview = await this._interviewRepository.create(obj)

        if (!interview) {
            throw createHttpError(_HttpStatus.INTERNAL_SERVER_ERROR, Messages.SERVER_ERROR)
        }

        return interview.meetingId
    }

    async getAllInterviews(userId: string): Promise<IInterviewSchema[]> {
        const interviews = await this._interviewRepository.findAllByUserId(new Types.ObjectId(userId))

        return interviews
    }
}
