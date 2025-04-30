import { env } from '@configs'
import { kafka } from '../client'
import { Role } from '@types'

const producer = kafka.producer()

export const sendUserRegistrationEvent = async (userData: {
    userId: string
    fullName: string
    profilePicture: string
    email: string
    role: Role
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

        const emailMessage = {
            topic: 'send-email',
            messages: [
                {
                    value: JSON.stringify({
                        to: userData.email,
                        subject: 'Welcome to Enigma',
                        templateName: `welcome-${userData.role === 'student' ? 'user' : 'recruiter'}`,
                        templateData: {
                            name: userData.fullName,
                            ctaLink: `${env.FRONTEND_ORIGIN}${userData.role === 'recruiter' ? '/recruiter' : ''}`,
                        },
                    }),
                },
            ],
        }

        await producer.send(emailMessage)
        console.log('User registration event sent successfully:', userData)
    } catch (error) {
        console.error('Failed to send user registration event:', error)
    } finally {
        await producer.disconnect()
    }
}
