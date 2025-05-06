import leaderboardRepository from '@repositories/implementation/leaderboard.repository'
import { kafka } from '../client'
import { retryProcessing } from '@utils'

interface UserUpdateEvent {
    userId: string
    username?: string
    profilePicture?: string
}

const consumer = kafka.consumer({ groupId: 'problem-service-user-updation' })

const processMessage = async (message: { value: Buffer }) => {
    try {
        const userData = JSON.parse(message.value.toString())

        const obj: Omit<UserUpdateEvent, 'userId'> = {}
        if (userData.username) obj.username = userData.username
        if (userData.profilePicture) obj.profilePicture = userData.profilePicture
        await leaderboardRepository.updateUserById(userData.userId, obj)
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to process message: ${error.message}`)
        } else {
            throw new Error(`Failed to process message: ${JSON.stringify(error)}`)
        }
    }
}

export const UserUpdateConsumer = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: 'user-updation', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received message from topic ${topic}, partition ${partition}`)
            retryProcessing(message as { value: Buffer<ArrayBufferLike> }, processMessage)
        },
    })
}
