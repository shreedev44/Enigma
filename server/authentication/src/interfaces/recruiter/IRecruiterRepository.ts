import { RecruiterProfileType } from "../../Types/types";

export interface IRecruiterRepository {
    create(user: RecruiterProfileType): Promise<RecruiterProfileType>;
    findByUserId(userId: string): Promise<RecruiterProfileType>
}