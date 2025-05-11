import { ISubscriptionSchema } from '@entities'
import Stripe from 'stripe'

export interface ISubscriptionService {
    createCheckoutSession(planId: string, userId: string): Promise<string>
    handleWebHook(eventData: unknown, signature: string): Promise<void>
    getSessionDetails(sessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>
    getSubscription(userId: string): Promise<ISubscriptionSchema>
}
