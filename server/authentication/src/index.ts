//* Importing libraries and packages
import dotenv from "dotenv";
import path from "path";
import express, { Application } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

//* Importing configs and initializers
import connectDB from "./config/DB";
import { initRedisClient } from "./config/Redis";
import validateEnv from "./utils/ValidateEnv";
import { env } from "./config/ENV";
import { cloudinaryConfig } from "./config/Cloudinary";
import { errorHandler, notFoundHandler } from "./app/middlewares/ErrorHandler";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

//* Importing routers
import userRouter from "./app/routes/UserRouter";
import studentRouter from "./app/routes/StudentRouter";
import recruiterRouter from "./app/routes/RecruiterRouter";

class App {
  public app: Application;

  constructor() {
    validateEnv();

    this.app = express();

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeDatabase();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(morgan("combined"));
  }

  private initializeRoutes(): void {
    this.app.use("/", userRouter);
    this.app.use("/student", studentRouter);
    this.app.use("/recruiter", recruiterRouter);
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private initializeDatabase(): void {
    connectDB();
    initRedisClient();
    cloudinaryConfig();
  }

  public listen(): void {
    this.app.listen(env.PORT, () =>
      console.log(`Server running on http://localhost:${env.PORT}`)
    );
  }
}

const app = new App();
app.listen();
