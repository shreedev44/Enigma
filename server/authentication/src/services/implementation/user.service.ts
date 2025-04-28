import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongoose'
import {
    createHttpError,
    otpPage,
    forgotPasswordPage,
    otpGenerator,
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    generateUID,
} from '@utils'
import { _HttpStatus, Messages } from '@constants'
import { GoogleAuthUserType, LoginResponseType, RecruiterProfileType, Role, StudentProfileType, UserType } from '@types'
import { env, transporter, redisClient } from '@configs'
import { IUserService } from '@services/interface'
import { IUserRepository } from '@repositories/interface'
import { IStudentRepository } from '@repositories/interface'
import { IRecruiterRepository } from '@repositories/interface'
import { UserDTO } from '@dtos'
import { sendUserRegistrationEvent } from '@producers'

export class UserService implements IUserService {
    constructor(
        private _userRepository: IUserRepository,
        private _studentRepository: IStudentRepository,
        private _recruiterRepository: IRecruiterRepository
    ) {}

    async register(user: UserType): Promise<string> {
        const userExisting = await this._userRepository.findByEmail(user.email)
        if (userExisting) {
            throw createHttpError(_HttpStatus.CONFLICT, Messages.USER_EXIST)
        }

        user.password = await bcrypt.hash(user.password as string, 10)

        const otp = otpGenerator()

        const mailOptions = {
            from: env.USER_EMAIL,
            to: user.email,
            subject: 'Your One-Time Password',
            html: otpPage(otp),
        }

        try {
            await transporter.sendMail(mailOptions)
        } catch (err) {
            console.log(err)
            throw createHttpError(_HttpStatus.INTERNAL_SERVER_ERROR, Messages.OTP_ERROR)
        }

        const storeObject = JSON.stringify({
            otp: otp,
            userData: user,
        })

        await redisClient.setEx(user.email, 300, storeObject)

        return user.email as string
    }

    async verifyOtp(otp: string, email: string): Promise<void> {
        const storedData = await redisClient.get(email)
        if (!storedData) {
            throw createHttpError(_HttpStatus.UNAUTHORIZED, Messages.OTP_EXPIRED)
        }

        const { otp: storedOtp, userData } = JSON.parse(storedData)

        if (storedOtp !== otp) {
            throw createHttpError(_HttpStatus.BAD_REQUEST, Messages.INCORRECT_OTP)
        }

        const userObject: Partial<UserType> = {
            email: userData.email as string,
            password: userData.password as string,
            role: userData.role as Role,
        }

        const user = await this._userRepository.create(userObject)

        if (user.role === 'student') {
            const profileObject: Partial<StudentProfileType> = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                userId: user._id as ObjectId,
            }
            const profile = await this._studentRepository.create(profileObject)
            await sendUserRegistrationEvent({
                userId: String(user._id),
                fullName: profile.firstName + ' ' + profile.lastName,
                profilePicture: profile.profilePicture || '',
            })
        } else if (user.role === 'recruiter') {
            const profileObject: Partial<RecruiterProfileType> = {
                companyName: userData.companyName,
                userId: user._id as ObjectId,
            }
            await this._recruiterRepository.create(profileObject)
        }
    }

    async resendOtp(email: string): Promise<void> {
        const storedData = await redisClient.get(email)
        if (!storedData) {
            throw createHttpError(_HttpStatus.BAD_REQUEST, Messages.OTP_EXPIRED)
        }

        const { userData } = JSON.parse(storedData)

        const otp = otpGenerator()

        await redisClient.setEx(email, 300, JSON.stringify({ otp, userData }))

        const mailOptions = {
            from: env.USER_EMAIL,
            to: userData.email,
            subject: 'Your One-Time Password',
            html: otpPage(otp),
        }

        try {
            await transporter.sendMail(mailOptions)
        } catch (err) {
            console.log(err)
            throw createHttpError(_HttpStatus.INTERNAL_SERVER_ERROR, Messages.OTP_ERROR)
        }
    }

    async verifyUser(
        email: string,
        password: string,
        role: Role
    ): Promise<{
        accessToken: string
        refreshToken: string
        user: UserType
        profile?: StudentProfileType | RecruiterProfileType
    }> {
        const user = await this._userRepository.findByEmail(email)

        if (!user) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND)
        }

        if (!user.password) {
            throw createHttpError(_HttpStatus.BAD_REQUEST, Messages.USE_SOCIAL)
        }

        const passwordCorrect = await bcrypt.compare(password, user.password as string)

        if (!passwordCorrect) {
            throw createHttpError(_HttpStatus.BAD_REQUEST, Messages.PASSWORD_INCORRECT)
        }

        if (user.status === 'blocked') {
            throw createHttpError(_HttpStatus.UNAUTHORIZED, Messages.USER_BLOCKED)
        }

        if (user.role !== role) {
            throw createHttpError(_HttpStatus.UNAUTHORIZED, Messages.NO_ACCESS)
        }

        const accessToken = generateAccessToken(String(user._id), role)
        const refreshToken = generateRefreshToken(String(user._id), role)

        let profile: StudentProfileType | RecruiterProfileType
        if (role === 'student') {
            profile = await this._studentRepository.findByUserId(String(user._id))
            return new UserDTO.VerifyUser({ accessToken, refreshToken, user, profile })
        } else if (role === 'recruiter') {
            profile = await this._recruiterRepository.findByUserId(String(user._id))
            return new UserDTO.VerifyUser({ accessToken, refreshToken, user, profile })
        } else {
            return new UserDTO.VerifyUser({ accessToken, refreshToken, user })
        }
    }

    async googleAuth(
        user: GoogleAuthUserType,
        role: Role
    ): Promise<{
        accessToken: string
        refreshToken: string
        user: UserType
        profile?: StudentProfileType | RecruiterProfileType
    }> {
        const userExist = await this._userRepository.findByEmail(user.email)
        if (userExist) {
            if (userExist.status === 'blocked') {
                throw createHttpError(_HttpStatus.UNAUTHORIZED, Messages.USER_BLOCKED)
            }

            if (userExist.role !== role) {
                throw createHttpError(_HttpStatus.UNAUTHORIZED, Messages.NO_ACCESS)
            }

            const accessToken = generateAccessToken(String(userExist._id), role)
            const refreshToken = generateRefreshToken(String(userExist._id), role)

            let profile: StudentProfileType | RecruiterProfileType
            if (role === 'student') {
                profile = await this._studentRepository.findByUserId(String(userExist._id))
                if (profile.profilePicture === '') {
                    profile = (await this._studentRepository.updateById(String(userExist._id), {
                        profilePicture: user.profilePicture,
                    })) as StudentProfileType
                }
                return new UserDTO.VerifyUser({ accessToken, refreshToken, user: userExist, profile })
            } else {
                profile = await this._recruiterRepository.findByUserId(String(userExist._id))
                if (profile.profilePicture === '') {
                    profile = (await this._recruiterRepository.updateById(String(userExist._id), {
                        profilePicture: user.profilePicture,
                    })) as RecruiterProfileType
                }
                return new UserDTO.VerifyUser({ accessToken, refreshToken, user: userExist, profile })
            }
        } else {
            const userObject: Partial<UserType> = {
                email: user.email,
                role,
            }

            const userData = await this._userRepository.create(userObject)

            let profile
            if (userData.role === 'student') {
                const profileObject: Partial<StudentProfileType> = {
                    firstName: user.firstName as string,
                    lastName: user.lastName as string,
                    userId: userData._id as ObjectId,
                    profilePicture: user.profilePicture,
                }
                profile = await this._studentRepository.create(profileObject)
                await sendUserRegistrationEvent({
                    userId: String(userData._id),
                    fullName: profile.firstName + ' ' + profile.lastName,
                    profilePicture: profile.profilePicture || '',
                })
            } else {
                const profileObject: Partial<RecruiterProfileType> = {
                    companyName: user.companyName as string,
                    userId: userData._id as ObjectId,
                    profilePicture: user.profilePicture,
                }
                profile = await this._recruiterRepository.create(profileObject)
            }

            const accessToken = generateAccessToken(String(userData._id), role)
            const refreshToken = generateRefreshToken(String(userData._id), role)

            return new UserDTO.VerifyUser({ accessToken, refreshToken, user: userData, profile })
        }
    }

    async githubAuth(code: string): Promise<LoginResponseType> {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: env.GITHUB_CLIENT_ID,
                client_secret: env.GITHUB_SECRET,
                code,
            }),
        })

        const { access_token } = await tokenResponse.json()

        const userResponse = await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${access_token}` },
        })

        const user = await userResponse.json()

        if (!user.email) {
            throw createHttpError(_HttpStatus.BAD_REQUEST, Messages.NO_EMAIL)
        }

        const userExist = await this._userRepository.findByEmail(user.email)

        if (userExist) {
            if (userExist.status === 'blocked') {
                throw createHttpError(_HttpStatus.UNAUTHORIZED, Messages.USER_BLOCKED)
            }

            if (userExist.role !== 'student') {
                throw createHttpError(_HttpStatus.UNAUTHORIZED, Messages.NO_ACCESS)
            }

            const accessToken = generateAccessToken(String(userExist._id), 'student')
            const refreshToken = generateRefreshToken(String(userExist._id), 'student')

            let profile = await this._studentRepository.findByUserId(String(userExist._id))

            let haveUpdate = false
            const updateObj: { profilePicture?: string; githubProfile?: string } = {}
            if (profile.profilePicture === '') {
                updateObj.profilePicture = user.avatar_url
                haveUpdate = true
            }
            if (profile.githubProfile === '') {
                updateObj.githubProfile = user.html_url
                haveUpdate = true
            }

            if (haveUpdate) {
                profile = (await this._studentRepository.updateById(
                    String(userExist._id),
                    updateObj
                )) as StudentProfileType
            }

            return new UserDTO.VerifyUser({ accessToken, refreshToken, user: userExist, profile })
        }

        const userObject: Partial<UserType> = {
            email: user.email,
            role: 'student',
        }

        const userData = await this._userRepository.create(userObject)

        const profileObject: Partial<StudentProfileType> = {
            firstName: user.login,
            profilePicture: user.avatar_url,
            githubProfile: user.html_url,
            userId: userData._id as ObjectId,
        }

        const profile = await this._studentRepository.create(profileObject)
        await sendUserRegistrationEvent({
            userId: String(user._id),
            fullName: profile.firstName + ' ' + profile.lastName,
            profilePicture: profile.profilePicture || '',
        })

        const accessToken = generateAccessToken(String(userData._id), 'student')
        const refreshToken = generateRefreshToken(String(userData._id), 'student')

        return new UserDTO.VerifyUser({ accessToken, refreshToken, user: userData, profile })
    }

    async changePassword(email: string): Promise<void> {
        const user = await this._userRepository.findByEmail(email)
        if (!user) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND)
        }

        if (!user.password) {
            throw createHttpError(_HttpStatus.BAD_REQUEST, Messages.USE_SOCIAL)
        }

        const token = await generateUID()

        const link = `${env.FRONTEND_ORIGIN}${
            user.role === 'student' ? '' : user.role === 'recruiter' ? '/recruiter' : '/admin'
        }/reset-password?token=${token}`

        const mailOptions = {
            from: env.USER_EMAIL,
            to: user.email,
            subject: 'Reset your password',
            html: forgotPasswordPage(link),
        }

        try {
            await transporter.sendMail(mailOptions)
        } catch (err) {
            console.log(err)
            throw createHttpError(_HttpStatus.INTERNAL_SERVER_ERROR, Messages.OTP_ERROR)
        }

        await redisClient.setEx(token, 300, String(user._id))
    }

    async resetPassword(token: string, password: string): Promise<void> {
        const storedId = await redisClient.get(token)

        if (!storedId) {
            throw createHttpError(_HttpStatus.UNAUTHORIZED, Messages.LINK_EXPIRED)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await this._userRepository.updateById(storedId, {
            password: hashedPassword,
        })
    }

    async refreshToken(token: string): Promise<string> {
        const payload = verifyToken(token)

        if (!payload) {
            throw createHttpError(_HttpStatus.UNAUTHORIZED, Messages.INVALID_TOKEN)
        }

        const user = await this._userRepository.findById(payload.id)

        if (!user) {
            throw createHttpError(_HttpStatus.UNAUTHORIZED, Messages.USER_NOT_FOUND)
        }
        if (user.status !== 'active') {
            throw createHttpError(_HttpStatus.UNAUTHORIZED, Messages.USER_BLOCKED)
        }

        const accessToken = generateAccessToken(String(user._id), user.role)

        return accessToken
    }

    async getRecruiter(recruiterId: string): Promise<{ companyName: string; bio: string; profilePicture: string }> {
        const recruiter = await this._recruiterRepository.findByUserId(recruiterId)

        if (!recruiter) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.USER_NOT_FOUND)
        }

        return {
            companyName: recruiter.companyName as string,
            bio: recruiter.bio as string,
            profilePicture: recruiter.profilePicture as string,
        }
    }
}
