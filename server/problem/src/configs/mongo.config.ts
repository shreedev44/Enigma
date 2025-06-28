import mongoose, { Error } from 'mongoose'
import { env } from '@configs'
import winstonLogger from '@loggers/winston.logger'

const MAX_RETRIES = 5
let retries = 0

export async function connectDB() {
    const connectWithRetry = async () => {
        try {
            await mongoose.connect(env.MONGO_URI as string)
            console.log(env.MONGO_URI)
            console.log('✅ MongoDB connected')
            winstonLogger.info('✅ MongoDB connected')
        } catch (err) {
            let errorMessage = ''
            if (err instanceof Error) errorMessage = err.message
            else errorMessage = String(err)
            console.error(`❌ MongoDB connection failed (Attempt ${retries + 1}/${MAX_RETRIES})`, err)
            winstonLogger.error('❌ MongoDB connection failed', {
                attempt: retries + 1,
                maxRetries: MAX_RETRIES,
                error: errorMessage,
            })

            retries++
            if (retries < MAX_RETRIES) {
                const delay = Math.pow(2, retries) * 1000
                console.log(`🔁 Retrying in ${delay / 1000} seconds...`)
                winstonLogger.warn('🔁 Retrying MongoDB connection', {
                    delayMs: delay,
                    attempt: retries,
                })
                setTimeout(connectWithRetry, delay)
            } else {
                console.error('🚨 Maximum retries reached. Exiting process.')
                winstonLogger.error('🚨 MongoDB connection failed after maximum retries. Exiting.')
                process.exit(1)
            }
        }
    }

    mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected.')
        winstonLogger.warn('⚠️ MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
        console.info('🔄 MongoDB reconnected.')
        winstonLogger.info('🔄 MongoDB reconnected')
    })

    mongoose.connection.on('error', (err) => {
        console.error('⛔ MongoDB error:', err)
        winstonLogger.error('⛔ MongoDB connection error', { error: err.message })
    })

    connectWithRetry()
}
