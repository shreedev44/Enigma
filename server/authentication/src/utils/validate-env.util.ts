import { env } from "@configs"

export function validateEnv() {
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
    if(!env.REDIS_URL) {
        throw new Error("REDIS_URL is not found in the env")
    }
    if(!env.USER_EMAIL) {
        throw new Error("USER_EMAIL is not found in the env")
    }
    if(!env.USER_PASS) {
        throw new Error("USER_PASS is not found in the env")
    }
    if(!env.GITHUB_CLIENT_ID) {
        throw new Error("GITHUB_CLIENT_ID is not found in the env")
    }
    if(!env.GITHUB_SECRET) {
        throw new Error("GITHUB_SECRET is not found in the env")
    }
    if(!env.FRONTEND_ORIGIN) {
        throw new Error("FRONTEND_ORIGIN is not found in the env")
    }
    if(!env.CLOUDINARY_API_KEY) {
        throw new Error("CLOUDINARY_API_KEY is not found in the env")
    }
    if(!env.CLOUDINARY_API_SECRET) {
        throw new Error("CLOUDINARY_API_SECRET is not found in the env")
    }
}