//* Importing libraries and packages
import dotenv from 'dotenv'
import path from 'path'
import express, { Application } from "express";
import morgan from 'morgan'

//* Importing configs and initializers
import connectDB from "./config/DB";
import { initRedisClient } from "./config/Redis";
import validateEnv from "./utils/ValidateEnv";
import { env } from "./config/ENV";

dotenv.config({ path: path.resolve(__dirname, "../.env") });


//* Importing routers
import userRouter from "./app/routes/UserRouter";



class App{
    public app: Application;

    constructor () {
        validateEnv()

        this.app = express()

        this.initializeMiddlewares()
        this.initializeRoutes()
        this.initializeDatabase()
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended: true}))
        this.app.use(morgan('combined'))
    }

    private initializeRoutes(): void {
        this.app.use('/', userRouter);
    }

    private initializeDatabase(): void {
        connectDB();
        initRedisClient();
    }

    public listen(): void {
        this.app.listen(env.PORT, () => console.log(`Server running on http://localhost:${env.PORT}`))
    }
}


const app = new App()
app.listen()