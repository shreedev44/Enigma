//* Importing libraries and packages
import dotenv from 'dotenv'
import path from 'path'
import express, { Application } from 'express'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

//* Importing configs, loggers and initializers
import morganLogger from '@loggers/morgan.logger'
import { validateEnv } from '@utils'
import { connectDB, env, initRedisClient } from '@configs'
import { errorHandler, notFoundHandler } from '@middlewares'

//* Importing routers
import jobRouter from '@routes/job.router'
import applicationRouter from '@routes/application.router'
import interviewRouter from '@routes/interview.router'
import subscriptionPlanRouter from '@routes/subscription-plan.router'
import subscriptionRouter from '@routes/subscription.router'
import webhookRouter from '@routes/webhook.router'
import blacklistRouter from '@routes/blacklist.router'

class App {
    public app: Application

    constructor() {
        validateEnv()

        this.app = express()

        this.healthCheckup()
        this.initializeWebhookRoutes()
        this.initializeMiddlewares()
        this.initializeRoutes()
        this.initializeDatabase()
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(morganLogger)
    }

    private initializeRoutes(): void {
        this.app.use('/', jobRouter)
        this.app.use('/application', applicationRouter)
        this.app.use('/interview', interviewRouter)
        this.app.use('/subscription-plan', subscriptionPlanRouter)
        this.app.use('/subscription', subscriptionRouter)
        this.app.use('/blacklist', blacklistRouter)
        this.app.use(notFoundHandler)
        this.app.use(errorHandler)
    }

    private healthCheckup(): void {
        this.app.get('/health', (req, res) => {
            res.status(200).send('Healthy')
        })
    }

    private initializeWebhookRoutes(): void {
        this.app.use('/webhook', webhookRouter)
    }

    private initializeDatabase(): void {
        connectDB()
        initRedisClient()
    }

    public listen(): void {
        this.app.listen(env.PORT, () => console.log(`Server running on http://localhost:${env.PORT}`))
    }
}

const app = new App()
app.listen()
