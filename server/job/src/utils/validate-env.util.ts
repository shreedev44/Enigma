import { env } from '@configs'

export function validateEnv() {
    if (!env.PORT) {
        throw new Error('PORT is not found in the env')
    }
    if (!env.MONGO_URI) {
        throw new Error('MONGO_URI is not found in the env')
    }
    if (!env.REDIS_URL) {
        throw new Error('REDIS_URL is not found in the env')
    }
    if (!env.LOKI_HOST) {
        throw new Error('LOKI_HOST is not found in the env')
    }
    if (!env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not found in the env')
    }
    if (!env.AWS_ACCESS_KEY_ID) {
        throw new Error('AWS_ACCESS_KEY_ID is not found in the env')
    }
    if (!env.AWS_SECRET_ACCESS_KEY) {
        throw new Error('AWS_SECRET_ACCESS_KEY is not found in the env')
    }
    if (!env.AWS_REGION) {
        throw new Error('AWS_REGION is not found in the env')
    }
    if (!env.S3_BUCKET_NAME) {
        throw new Error('S3_BUCKET_NAME is not found in the env')
    }
    if (!env.FRONTEND_ORIGIN) {
        throw new Error('FRONTEND_ORIGIN is not found in the env')
    }
    if (!env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not found in the env')
    }
    if (!env.STRIPE_WEBHOOK_KEY) {
        throw new Error('STRIPE_API_KEY is not found in the env')
    }
    if (!env.STRIPE_SUCCESS_URL) {
        throw new Error('STRIPE_SUCCESS_URL is not found in the env')
    }
    if (!env.STRIPE_CANCEL_URL) {
        throw new Error('STRIPE_CANCEL_URL is not found in the env')
    }
    if (!env.TEST_DB_URI) {
        throw new Error('TEST_DB_URI is not found in the env')
    }
}
