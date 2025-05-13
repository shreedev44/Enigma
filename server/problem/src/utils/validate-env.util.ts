import { env } from '@configs'

export function validateEnv() {
    if (!env.PORT) {
        throw new Error('PORT is not found in the env')
    }
    if (!env.MONGO_URI) {
        throw new Error('MONGO_URI is not found in the env')
    }
    if (!env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not found in the env')
    }
    if (!env.LOKI_HOST) {
        throw new Error('LOKI_HOST is not found in the env')
    }
    if (!env.REDIS_URL) {
        throw new Error('REDIS_URL is not found in the env')
    }
}
