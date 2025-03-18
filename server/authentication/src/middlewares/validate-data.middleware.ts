import { NextFunction, Request, Response, RequestHandler } from "express";
import { HttpStatus, Messages } from "@constants"
import { config } from "dotenv";

export const validateData = (
  validationSchema: Record<
    string,
    { rules: RegExp[]; messages: string[]; optional?: boolean }
  >
): any => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field in validationSchema) {
      const value = req.body[field];

      if (!value && validationSchema[field].optional) continue;

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
