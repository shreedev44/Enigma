import { createClient, RedisClientType } from 'redis'
import { env } from '@configs'

let redisClient: RedisClientType

const initRedisClient = () => {
    if (!redisClient) {
        redisClient = createClient({
            url: env.REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 3) {
                        console.error('Max retry reached: Redis has reached its max connection retry attempts')
                        return false
                    }
                    console.log(`Retrying redis connection. Retries: ${retries + 1}`)
                    return Math.min(retries * 500, 5000)
                },
            },
        })

        redisClient.on('connect', () => {
            console.log('Redis client connected')
        })

        redisClient.on('error', (err: Error) => {
            console.error(err)
        })

        redisClient.connect().catch((err) => {
            console.error('Error connecting to redis:', err)
        })
    }

    return redisClient
}

export { redisClient, initRedisClient }
