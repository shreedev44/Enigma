import Recruiter, { RecruiterDocument } from '@models/recruiter.model'
import { RecruiterProfileType } from '@types'
import { IRecruiterRepository } from '@repositories/interface'
import { BaseRepository } from '@shreedev44/enigma-shared'

class RecruiterRepository extends BaseRepository<RecruiterDocument> implements IRecruiterRepository {
    constructor() {
        super(Recruiter)
    }
    async create(user: Partial<RecruiterProfileType>): Promise<RecruiterProfileType> {
        try {
            const userData = await this.model.create(user)
            return userData
        } catch (err) {
            console.log(err)
            throw new Error('Error creating user')
        }
    }

    async findByUserId(userId: string): Promise<RecruiterProfileType> {
        try {
            const user = await this.model.findOne({ userId })
            return user as RecruiterProfileType
        } catch (err) {
            console.log(err)
            throw new Error('Error finding profile by userId')
        }
    }

    async updateById(userId: string, data: Partial<RecruiterProfileType>): Promise<RecruiterProfileType | null> {
        try {
            await Recruiter.updateOne({ userId }, data)
            const profile = this.model.findOne({ userId })
            return profile
        } catch (err) {
            console.log(err)
            throw new Error('Error updating recruiter profile by userId')
        }
    }

    async findPicById(userId: string): Promise<string | undefined> {
        try {
            const user = await this.model.findOne({ userId })
            return user?.profilePicture
        } catch (err) {
            console.log(err)
            throw new Error('Error finding recruiter profile pic by userId')
        }
    }
}

export default new RecruiterRepository()
