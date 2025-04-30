import dotenv from 'dotenv';
dotenv.config();

import { startEmailConsumer } from './consumers/email.consumer';

startEmailConsumer().then(() => {
  console.log('Email service started and listening to Kafka...');
});
