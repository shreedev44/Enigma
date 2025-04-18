import { Kafka } from 'kafkajs'

export const kafka = new Kafka({
    clientId: 'problem-service',
    brokers: ['kafka:9092'],
})
