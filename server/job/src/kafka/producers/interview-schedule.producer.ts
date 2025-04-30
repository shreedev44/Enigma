import { env } from '@configs'
import { kafka } from '../client'

const producer = kafka.producer()

export const interviewScheduledEvent = async (applicationData: {
    fullName: string
    email: string
    jobTitle: string
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
                        subject: `Interview Scheduled for ${applicationData.jobTitle}`,
                        templateName: 'interview-scheduled',
                        templateData: {
                            name: applicationData.fullName,
                            jobTitle: applicationData.jobTitle,
                            interviewTime: applicationData.meetingTime,
                            timezone: 'IST',
                            meetingLink: `${env.FRONTEND_ORIGIN}/meet?roomID=${applicationData.meetingId}`,
                        },
                    }),
                },
            ],
        }

        await producer.send(message)
        console.log('User interview event sent successfully:')
    } catch (error) {
        console.error('Failed to send interview event event:', error)
    } finally {
        await producer.disconnect()
    }
}
