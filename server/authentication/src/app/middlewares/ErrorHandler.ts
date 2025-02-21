import { Request, Response, NextFunction } from "express";
import { HttpError } from "../../utils/http-error.util";
import { Messages } from "../../constants/message.constant";
import { HttpStatus } from "../../constants/status.constant";

export const errorHandler = (
  err: HttpError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = Messages.SERVER_ERROR;

  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    console.error("Unhandled", err);
  }

  res.status(statusCode).json({ error: message });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new HttpError(Messages.INVALID_REQUEST, HttpStatus.NOT_FOUND))
}
