import Recruiter from '../models/RecruiterSchema'
import { RecruiterProfileType } from '../Types/types'
import { IRecruiterRepository } from '../interfaces/recruiter/IRecruiterRepository'

class RecruiterRepository implements IRecruiterRepository {
    async create(user: RecruiterProfileType): Promise<RecruiterProfileType> {
        try {
            const userData = await Recruiter.create(user)
            return userData
        } catch (err) {
            console.log(err)
            throw new Error("Error creating user")
        }
    }

    async findByUserId(userId: string): Promise<RecruiterProfileType> {
        try {
            const user = await Recruiter.findOne({userId})
            return user as RecruiterProfileType
        } catch (err) {
            console.log(err)
            throw new Error("Error finding profile by userId")
        }
    }
}

export default new RecruiterRepository();