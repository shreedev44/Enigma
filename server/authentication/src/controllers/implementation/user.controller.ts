import { NextFunction, Request, Response } from "express";
import { IUserService } from "@services/interface"
import { IUserController } from "@controllers/interface";
import { HttpStatus, Messages } from "@constants"
import { GoogleAuthUserType, Role } from "@types";

export class UserController implements IUserController {
  constructor(private _userService: IUserService) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email = await this._userService.register(req.body);
      res.status(HttpStatus.OK).json({ email });
    } catch (err) {
      next(err)
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      next(err)
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      next(err)
    }
  }

  async verifyUser(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      next(err)
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      next(err)
    }
  }

  async githubAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      next(err)
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      next(err)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      next(err)
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      next(err)
    }
  }
}
