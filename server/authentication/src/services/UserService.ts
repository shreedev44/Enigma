import bcrypt from "bcryptjs";
import { createHttpError } from "../utils/HttpError";
import { HttpStatus } from "../constants/StatusConstants";
import { Messages } from "../constants/MessageConstants";
import otpPage from "../utils/OtpTemplate";
import { Role, StudentProfileType, UserType } from "../Types/types";
import { env } from "../config/ENV";
import { transporter } from "../config/Nodemailer";
import otpGenerator from "../utils/OtpGenerator";
import { IUserService } from "../interfaces/user/IUserService";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { redisClient } from "../config/Redis";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { ObjectId } from "mongoose";
import { generateAccessToken, generateRefreshToken } from "../utils/Token";

export class UserService implements IUserService {
  constructor(
    private _userRepository: IUserRepository,
    private _studentRepository: IStudentRepository
  ) {}

  async register(user: UserType): Promise<string> {
    const userExisting = await this._userRepository.findByEmail(user.email);
    if (userExisting) {
      throw createHttpError(HttpStatus.CONFLICT, Messages.USER_EXIST);
    }

    user.password = await bcrypt.hash(user.password as string, 10);

    const otp = otpGenerator();

    let mailOptions = {
      from: env.USER_EMAIL,
      to: user.email,
      subject: "Your One-Time Password",
      html: otpPage(otp),
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log(err);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Messages.OTP_ERROR
      );
    }

    const storeObject = JSON.stringify({
      otp: otp,
      userData: user,
    });

    await redisClient.setEx(user.email, 300, storeObject);

    return user.email as string;
  }

  async verifyOtp(otp: string, email: string): Promise<void> {
    const storedData = await redisClient.get(email);
    if(!storedData) {
      throw createHttpError(HttpStatus.FORBIDDEN, Messages.OTP_EXPIRED)
    }

    const { otp: storedOtp, userData } = JSON.parse(storedData)

    if(storedOtp !== otp) {
      throw createHttpError(HttpStatus.BAD_REQUEST, Messages.INCORRECT_OTP)
    }

    const userObject: UserType = {
      email: userData.email as string,
      password: userData.password as string,
      role: userData.role as Role
    }

    const user = await this._userRepository.create(userObject)

    if(user.role === 'student') {
      const profileObject: StudentProfileType = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        userId: user._id as ObjectId,
      }
      await this._studentRepository.create(profileObject)
    }
  }

  async verifyUser(email: string, password: string, role: Role): Promise<{accessToken: string, refreshToken: string, user: UserType}> {
    const user = await this._userRepository.findByEmail(email);

    if(!user || user.status === 'deleted') {
      throw createHttpError(HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND)
    }

    const passwordCorrect = await bcrypt.compare(password, user.password as string)

    if(!passwordCorrect) {
      throw createHttpError(HttpStatus.BAD_REQUEST, Messages.PASSWORD_INCORRECT)
    }

    if(user.status === 'blocked') {
      throw createHttpError(HttpStatus.FORBIDDEN, Messages.USER_BLOCKED)
    }

    const accessToken = generateAccessToken(String(user._id), role)
    const refreshToken = generateRefreshToken(String(user._id), role)

    return {accessToken, refreshToken, user}
  }
}
