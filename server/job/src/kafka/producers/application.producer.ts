import { env } from '@configs'
import { kafka } from '../client'

const producer = kafka.producer()

export const applicationReceivedEvent = async (applicationData: {
    fullName: string
    email: string
    jobTitle: string
}) => {
    try {
        await producer.connect()
        const message = {
            topic: 'send-email',
            messages: [
                {
                    value: JSON.stringify({
                        to: applicationData.email,
                        subject: `Job Application Received for ${applicationData.jobTitle}`,
                        templateName: 'application-confirmation',
                        templateData: {
                            name: applicationData.fullName,
                            jobTitle: applicationData.jobTitle,
                            ctaLink: `${env.FRONTEND_ORIGIN}/profie`,
                        },
                    }),
                },
            ],
        }

        await producer.send(message)
        console.log('User application event sent successfully:')
    } catch (error) {
        console.error('Failed to send application event event:', error)
    } finally {
        await producer.disconnect()
    }
}
