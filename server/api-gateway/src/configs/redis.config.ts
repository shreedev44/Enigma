import { createClient, RedisClientType } from 'redis'
import { env } from './env.config'
import winstonLogger from '../loggers/winston.logger'

let redisClient: RedisClientType
const MAX_RETRIES = 5

const initRedisClient = () => {
    if (!redisClient) {
        redisClient = createClient({
            url: env.REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > MAX_RETRIES) {
                        console.error('❌ Max retries reached: Redis connection failed.')
                        winstonLogger.error('❌ Max retries reached: Redis connection failed.', {
                            attempt: retries + 1,
                            maxRetries: MAX_RETRIES,
                        })
                        return false
                    }
                    const delay = Math.min(retries * 500, 5000)
                    console.log(`🔁 Retrying Redis connection... Attempt ${retries + 1}, next in ${delay}ms`)
                    winstonLogger.warn('🔁 Retrying Redis connection...', {
                        delayMs: delay,
                        attempt: retries,
                    })
                    return delay
                },
            },
        })

        redisClient.on('connect', () => {
            console.log('✅ Redis connected successfully')
            winstonLogger.info('✅ Redis connected successfully')
        })

        redisClient.on('error', (err: Error) => {
            console.error('⛔ Redis error:', err.message)
            winstonLogger.error('⛔ Redis error:', { error: err.message })
        })

        redisClient.connect().catch((err) => {
            console.error('🚨 Failed to connect to Redis:', err.message)
            winstonLogger.error('🚨 Failed to connect to Redis:', { error: err.message })
        })
    }

    return redisClient
}

export { redisClient, initRedisClient }
