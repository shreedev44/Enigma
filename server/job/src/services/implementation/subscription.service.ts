import { env } from '@configs'
import { _HttpStatus, Messages } from '@constants'
import { ISubscriptionPlanRepository, ISubscriptionRepository } from '@repositories/interface'
import { ISubscriptionService } from '@services/interface'
import { createHttpError, generateUID } from '@utils'
import { Types } from 'mongoose'
import Stripe from 'stripe'
import { stripe } from '@configs'
import { ISubscriptionSchema } from '@entities'

export class SubscriptionService implements ISubscriptionService {
    constructor(
        private _subscriptionRepository: ISubscriptionRepository,
        private _planRepository: ISubscriptionPlanRepository
    ) {}

    async createCheckoutSession(planId: string, userId: string): Promise<string> {
        const plan = await this._planRepository.findById(new Types.ObjectId(planId))

        if (!plan) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.PLAN_NOT_FOUND)
        }

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: plan.name },
                        unit_amount: plan.price * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: env.STRIPE_CANCEL_URL,
            payment_intent_data: {
                metadata: {
                    planId,
                    userId,
                    transactionId: await generateUID(20),
                },
            },
        }

        const session = await stripe.checkout.sessions.create(sessionParams)

        if (!session) {
            throw createHttpError(_HttpStatus.INTERNAL_SERVER_ERROR, Messages.SERVER_ERROR)
        }

        return session.url as string
    }

    async handleWebHook(eventData: unknown, signature: string): Promise<void> {
        const event = stripe.webhooks.constructEvent(
            eventData as string | Buffer<ArrayBufferLike>,
            signature,
            env.STRIPE_WEBHOOK_KEY as string
        )

        if (!event) {
            throw createHttpError(_HttpStatus.BAD_REQUEST, Messages.PAYMENT_FAILED)
        }

        const session = event.data.object as Stripe.Checkout.Session
        const paymentIntentId = session.payment_intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string)

        if (paymentIntent.status === 'succeeded') {
            const subscriptionExist = await this._subscriptionRepository.findByTransactionId(
                paymentIntent.metadata.transactionId
            )
            if (subscriptionExist) return
            const plan = await this._planRepository.findById(new Types.ObjectId(paymentIntent.metadata.planId))
            const expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + (plan?.durationInDays || 0))
            const oldSubscription = await this._subscriptionRepository.findLatestSubscription(
                paymentIntent.metadata.userId
            )

            if (oldSubscription && oldSubscription?.expiresAt > expiresAt) {
                expiresAt.setDate(oldSubscription?.expiresAt.getDate())
            }
            const subscriptionData: Partial<ISubscriptionSchema> = {
                ...paymentIntent.metadata,
                startedAt: new Date(Date.now()),
                expiresAt,
            }

            const subscription = await this._subscriptionRepository.create(subscriptionData)
            if (!subscription) {
                throw createHttpError(_HttpStatus.INTERNAL_SERVER_ERROR, Messages.SERVER_ERROR)
            }
        } else {
            throw createHttpError(_HttpStatus.BAD_REQUEST, Messages.PAYMENT_FAILED)
        }
    }

    async getSessionDetails(sessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session>> {
        const sessionDetails = await stripe.checkout.sessions.retrieve(sessionId)

        if (!sessionDetails) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.SESSION_NOT_FOUND)
        }

        return sessionDetails
    }

    async getSubscription(userId: string): Promise<ISubscriptionSchema> {
        const subscription = await this._subscriptionRepository.findLatestSubscription(userId)

        if (!subscription) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.NO_SUBSCRIPTION)
        }

        if (subscription.expiresAt < new Date()) {
            throw createHttpError(_HttpStatus.NOT_FOUND, Messages.NO_SUBSCRIPTION)
        }

        return subscription
    }
}
