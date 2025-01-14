import { Request, Response } from 'express'
import { IUserService } from '../../interfaces/user/IUserService'
import { IUserController } from '../../interfaces/user/IUserController'
import { HttpStatus } from '../../constants/StatusConstants'
import { HttpError } from '../../utils/HttpError'
import { Messages } from '../../constants/MessageConstants'

export class UserController implements IUserController{
    constructor(private _userService: IUserService) {}


    async register(req: Request, res: Response): Promise<void> {
        try {
            const email = await this._userService.register(req.body)
            res.status(HttpStatus.OK).json({email})
        } catch (err) {
            if(err instanceof HttpError){
                res.status(err.statusCode).json({error: err.message})
            } else{
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: Messages.SERVER_ERROR})
            }
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        try{
            const { otp, email } = req.body;

            if(!otp || !email) {
                res.status(HttpStatus.BAD_REQUEST).json({error: Messages.INCOMPLETE_FORM})
            }
            await this._userService.verifyOtp(otp, email)
            res.status(HttpStatus.CREATED).json({message: Messages.OTP_VERIFIED})
        } catch (err) {
            if(err instanceof HttpError) {
                res.status(err.statusCode).json({error: err.message})
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: Messages.SERVER_ERROR})
                console.log(err)
            }
        }
    }

    async verifyUser(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, role } = req.body;

            const {accessToken, refreshToken, user} = await this._userService.verifyUser(email, password, role)
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(HttpStatus.OK).json({accessToken, user})
        } catch (err) {
            if(err instanceof HttpError) {
                res.status(err.statusCode).json({error: err.message})
            } else {
                res.status(HttpStatus.BAD_REQUEST).json({error: Messages.SERVER_ERROR})
                console.log(err)
            }
        }
    }
}