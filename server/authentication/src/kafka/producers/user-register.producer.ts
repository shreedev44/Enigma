import { kafka } from '../client'

const producer = kafka.producer()

export const sendUserRegistrationEvent = async (userData: {
    userId: string
    fullName: string
    profilePicture: string
}) => {
    try {
        await producer.connect()
        const message = {
            topic: 'user-registration',
            messages: [
                {
                    key: userData.userId,
                    value: JSON.stringify({
                        userId: userData.userId,
                        username: userData.fullName,
                        profilePicture: userData.profilePicture,
                    }),
                },
            ],
        }

        await producer.send(message)
        console.log('User registration event sent successfully:', userData)
    } catch (error) {
        console.error('Failed to send user registration event:', error)
    } finally {
        await producer.disconnect()
    }
}
