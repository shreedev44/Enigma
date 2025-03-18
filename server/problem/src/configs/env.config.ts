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
}
