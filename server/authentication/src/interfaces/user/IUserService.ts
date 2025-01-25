import {
  GoogleAuthUserType,
  LoginResponseType,
  Role,
  UserType,
} from "../../Types/types";

export interface IUserService {
  register(user: UserType): Promise<string>;
  verifyOtp(otp: string, email: string): Promise<void>;
  resendOtp(email: string): Promise<void>;
  verifyUser(
    email: string,
    password: string,
    role: Role
  ): Promise<LoginResponseType>;
  googleAuth(user: GoogleAuthUserType, role: Role): Promise<LoginResponseType>;
  githubAuth(code: string): Promise<LoginResponseType>;
  changePassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  refreshToken(token: string): Promise<string>;
}
