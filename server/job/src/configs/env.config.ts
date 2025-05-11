export const env = {
    get PORT() {
        return process.env.PORT!
    },
    get MONGO_URI() {
        return process.env.MONGO_URI!
    },
    get LOKI_HOST() {
        return process.env.LOKI_HOST!
    },
    get REDIS_URL() {
        return process.env.REDIS_URL!
    },
    get GEMINI_API_KEY() {
        return process.env.GEMINI_API_KEY!
    },
    get AWS_ACCESS_KEY_ID() {
        return process.env.AWS_ACCESS_KEY_ID!
    },
    get AWS_SECRET_ACCESS_KEY() {
        return process.env.AWS_SECRET_ACCESS_KEY!
    },
    get AWS_REGION() {
        return process.env.AWS_REGION!
    },
    get S3_BUCKET_NAME() {
        return process.env.S3_BUCKET_NAME!
    },
    get FRONTEND_ORIGIN() {
        return process.env.FRONTEND_ORIGIN!
    },
    get STRIPE_SECRET_KEY() {
        return process.env.STRIPE_SECRET_KEY!
    },
    get STRIPE_WEBHOOK_KEY() {
        return process.env.STRIPE_WEBHOOK_KEY!
    },
    get STRIPE_SUCCESS_URL() {
        return process.env.STRIPE_SUCCESS_URL!
    },
    get STRIPE_CANCEL_URL() {
        return process.env.STRIPE_CANCEL_URL!
    },
}
