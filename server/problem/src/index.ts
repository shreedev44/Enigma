//* Importing libraries and packages
import dotenv from 'dotenv'
import express, { Application } from 'express'
import morgan from 'morgan'
import path from 'path'

//* Importing configs and initializers
import connectDB from './configs/mongo.config'
import validateEnv from './utils/validate-env.util'
import { env } from './configs/env.config'
import { errorHandler, notFoundHandler } from '@middlewares'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

//* Importing routers
import problemRouter from '@routes/problem.router'

class App {
    public app: Application

    constructor() {
        this.app = express()
        validateEnv()

        this.initializeMiddlewares()
        this.initializeRoutes()
        this.initializeDatabase()
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(morgan('tiny'))
    }

    private initializeRoutes(): void {
        this.app.use('/', problemRouter)
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
