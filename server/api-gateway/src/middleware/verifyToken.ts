import { NextFunction, Request, Response } from "express";
import { isPublic } from "../utils/publicRoutes";
import { env } from "../configs/envConfig";
import jwt from "jsonwebtoken";

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  try {
    if (isPublic(req)) {
      return next();
    }

    const authHeader = req.headers.authorization;

    console.log(authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(403)
        .json({ error: "Access denied, No token provided" });
    }
    
    const token = authHeader.split(" ")[1];
    if(!token) {
        return res
          .status(403)
          .json({ error: "Access denied, No token provided" });
    }

    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);

    req.headers['x-user-payload'] = JSON.stringify(payload)
    next();
  } catch (err: any) {
    console.log(err)
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token has expired" });
    } else {
      return res.status(403).json({ error: "Invalid token" });
    }
  }
}
