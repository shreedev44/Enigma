import { Request, Response } from "express";
import { IUserService } from "../../interfaces/user/IUserService";
import { IUserController } from "../../interfaces/user/IUserController";
import { HttpStatus } from "../../constants/StatusConstants";
import { HttpError } from "../../utils/HttpError";
import { Messages } from "../../constants/MessageConstants";
import { GoogleAuthUserType, Role } from "../../Types/types";

export class UserController implements IUserController {
  constructor(private _userService: IUserService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const email = await this._userService.register(req.body);
      res.status(HttpStatus.OK).json({ email });
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: Messages.SERVER_ERROR });
      }
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { otp, email } = req.body;

      if (!otp || !email) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: Messages.INCOMPLETE_FORM });
        return;
      }
      await this._userService.verifyOtp(otp, email);
      res.status(HttpStatus.CREATED).json({ message: Messages.OTP_VERIFIED });
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: Messages.SERVER_ERROR });
        console.log(err);
      }
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: Messages.INCOMPLETE_FORM });
        return;
      }

      await this._userService.resendOtp(email);
      res.status(HttpStatus.OK).json({ message: Messages.OTP_RESENT });
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: Messages.SERVER_ERROR });
        console.log(err);
      }
    }
  }

  async verifyUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, role } = req.body;

      const { accessToken, refreshToken, user, profile } =
        await this._userService.verifyUser(email, password, role);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json({ accessToken, user, profile });
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: Messages.SERVER_ERROR });
        console.log(err);
      }
    }
  }

  async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { role, ...userInfo } = req.body.user;
      const { accessToken, refreshToken, user, profile } =
        await this._userService.googleAuth(
          userInfo as GoogleAuthUserType,
          role as Role
        );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json({ accessToken, user, profile });
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: Messages.SERVER_ERROR });
        console.log(err);
      }
    }
  }

  async githubAuth(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.body;
      if (!code) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: Messages.INCOMPLETE_FORM });
        return;
      }

      const { accessToken, refreshToken, user, profile } =
        await this._userService.githubAuth(code);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(HttpStatus.OK).json({ accessToken, user, profile });
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: Messages.SERVER_ERROR });
        console.log(err);
      }
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: Messages.INCOMPLETE_FORM });
        return;
      }

      await this._userService.changePassword(email);
      res.status(HttpStatus.OK).json({ message: Messages.LINK_SENT });
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: Messages.SERVER_ERROR });
        console.log(err);
      }
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: Messages.INCOMPLETE_FORM });
        return;
      }
      await this._userService.resetPassword(token, password);
      res.status(HttpStatus.OK).json({ message: Messages.PASSWORD_CHANGED });
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.statusCode).json({ error: err.message });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: Messages.SERVER_ERROR });
        console.log(err);
      }
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      if(!req.cookies) {
        res.status(HttpStatus.FORBIDDEN).json({error: Messages.NO_TOKEN})
        return;
      }
      const refreshToken = req.cookies.refreshToken;
      if(!refreshToken) {
        res.status(HttpStatus.FORBIDDEN).json({error: Messages.NO_TOKEN})
        return;
      }
      const accessToken = await this._userService.refreshToken(refreshToken)
      res.status(HttpStatus.OK).json({accessToken})
    } catch (err) {
      if(err instanceof HttpError) {
        res.status(err.statusCode).json({error: err.message});
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: Messages.SERVER_ERROR})
        console.log(err)
      }
    }
  }
}
