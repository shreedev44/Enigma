import { kafka } from '../client'

const producer = kafka.producer()

export const sendUserUpdationEvent = async (userData: {
    userId: string
    fullName?: string
    profilePicture?: string
}) => {
    try {
        await producer.connect()
        const message = {
            topic: 'user-updation',
            messages: [
                {
                    key: userData.userId,
                    value: JSON.stringify(userData),
                },
            ],
        }

        await producer.send(message)
        console.log('User updation event sent successfully:', userData)
    } catch (error) {
        console.error('Failed to send user updation event:', error)
    } finally {
        await producer.disconnect()
    }
}
