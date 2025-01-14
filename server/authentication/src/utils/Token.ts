import jwt from "jsonwebtoken";
import { env } from "../config/ENV";
import { Role } from "../Types/types";

export function generateAccessToken(userId: string, role: Role) {
    return jwt.sign({id: userId, role}, env.JWT_ACCESS_SECRET, {expiresIn: '60m'});
}

export function generateRefreshToken(userId: string, role: Role) {
    return jwt.sign({id: userId, role}, env.JWT_REFRESH_SECRET, {expiresIn: '7d'});
}