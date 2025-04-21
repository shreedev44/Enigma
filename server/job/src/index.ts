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



class App {
    public app: Application

    constructor() {
        validateEnv()

        this.app = express()

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
        this.app.use(notFoundHandler)
        this.app.use(errorHandler)
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