import { env } from '../config/env.config'

export default function validateEnv() {
    if(!env.PORT) {
        throw new Error("PORT is not found in the env")
    }
    if(!env.MONGO_URI) {
        throw new Error("MONGO_URI is not found in the env")
    }
}