import { env } from '@configs'
import { kafka } from '../client'

const producer = kafka.producer()

export const applicationShortlistedEvent = async (applicationData: {
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
                        subject: `Job Application Shortlisted for ${applicationData.jobTitle}`,
                        templateName: 'application-shortlisted',
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
        console.log('User application shortlist event sent successfully:')
    } catch (error) {
        console.error('Failed to send application shortlist event:', error)
    } finally {
        await producer.disconnect()
    }
}
