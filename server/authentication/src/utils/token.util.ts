import jwt from "jsonwebtoken";
import { env } from "../config/env.config";
import { Role } from "../Types/types";

export function generateAccessToken(userId: string, role: Role) {
    return jwt.sign({id: userId, role}, env.JWT_ACCESS_SECRET, {expiresIn: '1h'});
}

export function generateRefreshToken(userId: string, role: Role) {
    return jwt.sign({id: userId, role}, env.JWT_REFRESH_SECRET, {expiresIn: '7d'});
}

export function verifyToken(token: string) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as {id: string, role: Role};
}