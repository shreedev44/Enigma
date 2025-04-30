import { Kafka } from 'kafkajs';
import { sendEmail } from '../services/email.service';

const kafka = new Kafka({ clientId: 'email-service', brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'email-group' });

export const startEmailConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'send-email', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value!.toString());

      try {
        await sendEmail(data);
        console.log(`Email sent to: ${data.to}`);
      } catch (error) {
        console.error(`Failed to send email to ${data.to}`, error);
      }
    },
  });
};
