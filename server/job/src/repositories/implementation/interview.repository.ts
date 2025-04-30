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
}

export default new InterviewRepository()
