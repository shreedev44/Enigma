import { NextFunction, Request, Response } from "express";
import { isPublic } from "../utils/public-routes.util";
import { env } from "../configs/env.config";
import jwt from "jsonwebtoken";
import { UserPayloadType } from "../types";
import { redisClient } from "../configs/redis.config";

export default async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  try {
    if (isPublic(req)) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ error: "Access denied, No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied, No token provided" });
    }

    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as UserPayloadType;

    if (payload.role !== req.path.split("/")[2]) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const isBlocked = await redisClient.exists(`blacklist:${payload.id}`)
    if(isBlocked) {
      res.status(401).json({error: "Your are blocked from Enigma"})
      await redisClient.del(`blacklist:${payload.id}`)
      return
    }

    req.headers["x-user-payload"] = JSON.stringify(payload);
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token has expired" });
    } else {
      return res.status(401).json({ error: "Invalid token" });
    }
  }
}
