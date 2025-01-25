import { UserType } from "../../Types/types";

export interface IUserRepository {
    create(user: UserType): Promise<UserType>;
    findByEmail(email: string): Promise<UserType | null>;
    findById(id: string): Promise<UserType | null>;
    updateById(id: string, data: Partial<UserType>): Promise<UserType | null>;
}