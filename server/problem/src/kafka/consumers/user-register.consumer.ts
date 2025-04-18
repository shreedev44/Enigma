import leaderboardRepository from '@repositories/implementation/leaderboard.repository'
import { kafka } from '../client'

interface UserRegistrationEvent {
    userId: string
    username: string
    profilePicture: string
}

const consumer = kafka.consumer({ groupId: 'user-registration-group' })

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 5000

const processMessage = async (message: { value: Buffer }) => {
    try {
        const userData: UserRegistrationEvent = JSON.parse(message.value.toString())

        const totalUsers = await leaderboardRepository.getCount()
        const obj = { ...userData, rank: totalUsers + 1 }
        await leaderboardRepository.create(obj)
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to process message: ${error.message}`)
        } else {
            throw new Error(`Failed to process message: ${JSON.stringify(error)}`)
        }
    }
}

const retryProcessing = async (message: { value: Buffer }, attempt = 1): Promise<void> => {
    try {
        await processMessage(message)
    } catch (_error) {
        if (attempt < MAX_RETRIES) {
            console.warn(`Retrying message processing (Attempt ${attempt + 1}/${MAX_RETRIES})...`)
            setTimeout(() => retryProcessing(message, attempt + 1), RETRY_DELAY_MS)
        } else {
            console.error('Max retries reached. Failed to process message:', message)
        }
    }
}

export const runConsumer = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: 'user-registration', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received message from topic ${topic}, partition ${partition}`)
            retryProcessing(message as { value: Buffer<ArrayBufferLike> })
        },
    })
}
