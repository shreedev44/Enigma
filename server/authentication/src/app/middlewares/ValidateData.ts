import { NextFunction, Request, Response, RequestHandler } from "express";
import { HttpStatus } from "../../constants/StatusConstants";
import { Messages } from "../../constants/MessageConstants";

export const validateData = (
  validationSchema: Record<string, { rules: RegExp[]; messages: string[] }>
): any => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field in validationSchema) {
      const value = req.body[field];

      if (!value) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: Messages.INCOMPLETE_FORM });
      }

      const { rules, messages } = validationSchema[field];

      for (let rule of rules) {
        if (!rule.test(value)) {
          return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ error: messages[rules.indexOf(rule)] });
        }
      }
    }
    next();
  };
};
