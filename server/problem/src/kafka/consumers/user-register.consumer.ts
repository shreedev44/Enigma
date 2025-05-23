import leaderboardRepository from '@repositories/implementation/leaderboard.repository'
import { kafka } from '../client'
import { retryProcessing } from '@utils'

interface UserRegistrationEvent {
    userId: string
    username: string
    profilePicture: string
}

const consumer = kafka.consumer({ groupId: 'problem-service-user-registration' })

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

export const UserRegistrationConsumer = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: 'user-registration', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received message from topic ${topic}, partition ${partition}`)
            retryProcessing(message as { value: Buffer<ArrayBufferLike> }, processMessage)
        },
    })
}
