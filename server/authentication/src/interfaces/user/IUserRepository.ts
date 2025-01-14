import { UserType } from "../../Types/types";

export interface IUserRepository {
    create(user: UserType): Promise<UserType>;
    findByEmail(email: string): Promise<UserType | null>
}