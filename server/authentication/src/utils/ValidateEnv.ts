export default function validateEnv() {
    if(!process.env.PORT) {
        throw new Error("PORT is not found in the env")
    }
    if(!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not found in the env")
    }
    if(!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not found in the env")
    }
}