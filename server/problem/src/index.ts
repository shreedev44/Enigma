//* Importing libraries and packages
import dotenv from 'dotenv'
import express, { Application } from 'express'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

//* Importing configs, loggers and initializers
import connectDB from './configs/mongo.config'
import validateEnv from './utils/validate-env.util'
import { env } from './configs/env.config'
import { errorHandler, notFoundHandler } from '@middlewares'
import morganLogger from '@loggers/morgan.logger'

//* Importing routers
import problemRouter from '@routes/problem.router'
import attemptRouter from '@routes/attempt.router'
import { runConsumer } from '@consumers'

class App {
    public app: Application

    constructor() {
        this.app = express()
        validateEnv()

        this.initializeMiddlewares()
        this.initializeRoutes()
        this.initializeDatabase()
        runConsumer().catch((error) => {
            console.error('Error running the consumer:', error)
        })
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(morganLogger)
    }

    private initializeRoutes(): void {
        this.app.use('/', problemRouter)
        this.app.use('/attempt', attemptRouter)
        this.app.use(notFoundHandler)
        this.app.use(errorHandler)
    }

    private initializeDatabase(): void {
        connectDB()
    }

    public listen(): void {
        this.app.listen(env.PORT, () => console.log(`Server running on http://localhost:${env.PORT}`))
    }
}

const app = new App()
app.listen()
