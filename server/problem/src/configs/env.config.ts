export const env = {
    get PORT() {
        return process.env.PORT!
    },
    get MONGO_URI() {
        return process.env.MONGO_URI!
    },
    get GEMINI_API_KEY() {
        return process.env.GEMINI_API_KEY!
    },
    get LOKI_HOST() {
        return process.env.LOKI_HOST!
    },
    get REDIS_URL() {
        return process.env.REDIS_URL!
    },
}
