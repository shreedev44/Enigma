//* Importing libraries and packages
import dotenv from 'dotenv'
import express, { Application } from 'express'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

//* Importing configs, loggers and initializers
import { connectDB, env, initRedisClient } from '@configs'
import { validateEnv } from '@utils'
import { errorHandler, notFoundHandler } from '@middlewares'
import morganLogger from '@loggers/morgan.logger'

//* Importing routers
import problemRouter from '@routes/problem.router'
import attemptRouter from '@routes/attempt.router'
import leaderboardRouter from '@routes/leaderboard.router'

import { UserRegistrationConsumer } from '@consumers'
import { UserUpdateConsumer } from './kafka/consumers/user-update.consumer'

class App {
    public app: Application

    constructor() {
        this.app = express()
        validateEnv()

        this.healthCheckup()
        this.initializeMiddlewares()
        this.initializeRoutes()
        this.initializeDatabase()
        this.initializeConsumers()
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(morganLogger)
    }

    private initializeRoutes(): void {
        this.app.use('/', problemRouter)
        this.app.use('/attempt', attemptRouter)
        this.app.use('/leaderboard', leaderboardRouter)
        this.app.use(notFoundHandler)
        this.app.use(errorHandler)
    }

    private healthCheckup(): void {
        this.app.get('/health', (req, res) => {
            res.status(200).send('Healthy')
        })
    }

    private initializeConsumers(): void {
        UserRegistrationConsumer().catch((error) => {
            console.error('Error running registration consumer:', error)
        })
        UserUpdateConsumer().catch((error) => {
            console.error('Error running updation consumer', error)
        })
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
