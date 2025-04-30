import { Kafka } from 'kafkajs'

export const kafka = new Kafka({
    clientId: 'job-service',
    brokers: ['kafka:9092'],
})
