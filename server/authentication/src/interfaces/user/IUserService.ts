import { Role, UserType } from "../../Types/types";

export interface IUserService {
    register(user: UserType): Promise<string>;
    verifyOtp(otp: string, email: string): Promise<void>;
    verifyUser(email: string, password: string, role: Role): Promise<{accessToken: string, refreshToken: string, user: UserType}>;
}