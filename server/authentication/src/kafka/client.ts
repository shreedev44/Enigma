import { Kafka } from 'kafkajs'

export const kafka = new Kafka({
    clientId: 'authentication-service',
    brokers: ['kafka:9092'],
})
