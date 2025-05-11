import Stripe from 'stripe'
import { env } from './env.config'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-04-30.basil',
})
