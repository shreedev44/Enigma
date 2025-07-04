export const env = {
    get PORT() {
        return process.env.PORT!
    },
    get MONGO_URI() {
        return process.env.MONGO_URI!
    },
    get JWT_ACCESS_SECRET() {
        return process.env.JWT_ACCESS_SECRET!
    },
    get JWT_REFRESH_SECRET() {
        return process.env.JWT_REFRESH_SECRET!
    },
    get REDIS_URL() {
        return process.env.REDIS_URL!
    },
    get USER_EMAIL() {
        return process.env.USER_EMAIL!
    },
    get USER_PASS() {
        return process.env.USER_PASS!
    },
    get GITHUB_CLIENT_ID() {
        return process.env.GITHUB_CLIENT_ID!
    },
    get GITHUB_SECRET() {
        return process.env.GITHUB_SECRET!
    },
    get FRONTEND_ORIGIN() {
        return process.env.FRONTEND_ORIGIN!
    },
    get CLOUDINARY_CLOUD_NAME() {
        return process.env.CLOUDINARY_CLOUD_NAME!
    },
    get CLOUDINARY_API_KEY() {
        return process.env.CLOUDINARY_API_KEY!
    },
    get CLOUDINARY_API_SECRET() {
        return process.env.CLOUDINARY_API_SECRET!
    },
    get LOKI_HOST() {
        return process.env.LOKI_HOST!
    },
    get TEST_DB_URI() {
        return process.env.TEST_DB_URI!
    },
}
