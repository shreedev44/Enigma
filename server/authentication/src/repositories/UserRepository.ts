import User from '../models/UserSchema'
import { UserType } from '../Types/types';

class UserRepository{
    async create(user: Partial<UserType>): Promise<UserType> {
        return User.create(user)
    }

    async findByEmail(email: string): Promise<UserType | null> {
        return User.findOne({email})
    }
}

export default new UserRepository();