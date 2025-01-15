import { env } from "../config/ENV"

export default function validateEnv() {
    if(!env.PORT) {
        throw new Error("PORT is not found in the env")
    }
    if(!env.MONGO_URI) {
        throw new Error("MONGO_URI is not found in the env")
    }
    if(!env.JWT_ACCESS_SECRET) {
        throw new Error("JWT_ACCESS_SECRET is not found in the env")
    }
    if(!env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET is not found in the env")
    }
    if(!env.REDIS_URI) {
        throw new Error("REDIS_URI is not found in the env")
    }
    if(!env.USER_EMAIL) {
        throw new Error("USER_EMAIL is not found in the env")
    }
    if(!env.USER_PASS) {
        throw new Error("USER_PASS is not found in the env")
    }
}