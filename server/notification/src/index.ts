import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import { startEmailConsumer } from './consumers/email.consumer';
import { validateEnv } from './utils/validate-env.util';
import { env } from './configs/env.config';

validateEnv()

const app = express()

app.get('/health', (req, res) => {
  res.status(200).send('Healthy')
})

app.listen(env.PORT, () => {
  console.log('Notification service running on 3004...')
})


startEmailConsumer().then(() => {
  console.log('Email service started and listening to Kafka...');
});
