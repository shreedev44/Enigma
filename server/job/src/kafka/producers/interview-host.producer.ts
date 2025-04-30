import { env } from '@configs'
import { kafka } from '../client'

const producer = kafka.producer()

export const interviewHostEvent = async (applicationData: {
    email: string
    meetingTime: string
    meetingId: string
}) => {
    try {
        await producer.connect()
        const message = {
            topic: 'send-email',
            messages: [
                {
                    value: JSON.stringify({
                        to: applicationData.email,
                        subject: `🧑‍💼 You’re Hosting an Interview`,
                        templateName: 'interview-hosted',
                        templateData: {
                            interviewTime: applicationData.meetingTime,
                            timezone: 'IST',
                            meetingLink: `${env.FRONTEND_ORIGIN}/meet?roomID=${applicationData.meetingId}`,
                        },
                    }),
                },
            ],
        }

        await producer.send(message)
        console.log('Recruiter interview event sent successfully:')
    } catch (error) {
        console.error('Failed to send recruiter interview event:', error)
    } finally {
        await producer.disconnect()
    }
}
