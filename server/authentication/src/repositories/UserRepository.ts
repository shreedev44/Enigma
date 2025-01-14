import User from '../models/UserSchema'
import { UserType } from '../Types/types';
import { IUserRepository } from '../interfaces/user/IUserRepository';

class UserRepository implements IUserRepository{
    async create(user: UserType): Promise<UserType> {
        try{
            const userData = await User.create(user)
            return userData
        } catch(err) {
            console.error(err)
            throw new Error("Error creating user")
        }
    }

    async findByEmail(email: string): Promise<UserType | null> {
        try {
            const user = await User.findOne({email})
            return user
        } catch (err) {
            console.error(err)
            throw new Error("Error finding user by email")
        }
    }
}

export default new UserRepository();