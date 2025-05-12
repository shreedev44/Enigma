import { IInterviewSchema } from '@entities'
import Interview from '@models/interview.model'
import { IInterviewRepository } from '@repositories/interface'
import { BaseRepository } from '@shreedev44/enigma-shared'
import { Types } from 'mongoose'

class InterviewRepository extends BaseRepository<IInterviewSchema> implements IInterviewRepository {
    constructor() {
        super(Interview)
    }

    async findAllByUserId(userId: Types.ObjectId): Promise<IInterviewSchema[]> {
        try {
            const interviews = await this.model.find({ userId })
            return interviews
        } catch (err) {
            console.error(err)
            throw new Error('Error finding interviews')
        }
    }

    async canConductInterview(userId: Types.ObjectId, date: Date, totalMaxInterviews: number): Promise<boolean> {
        try {
            const interviewsUsed = await this.model.countDocuments({
                userId,
                createdAt: { $gte: date },
            })

            if (interviewsUsed < totalMaxInterviews) {
                return true
            } else {
                const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7))
                const interviewsThisWeek = await this.model.countDocuments({
                    userId,
                    createdAt: { $gte: oneWeekAgo },
                })

                return interviewsThisWeek < 5
            }
        } catch (err) {
            console.error(err)
            throw new Error('Error counting interviews from date')
        }
    }

    async deleteByApplicationId(applicationId: Types.ObjectId): Promise<void> {
        try {
            await this.model.deleteOne({ applicationId })
        } catch (err) {
            console.error(err)
            throw new Error('Error while deleting interview by application id')
        }
    }
}

export default new InterviewRepository()
