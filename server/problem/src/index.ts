//* Importing libraries and packages
import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
import path from "path";

//* Importing configs and initializers
import connectDB from "./config/DB";
import validateEnv from "./utils/ValidateEnv";
import { env } from "./config/ENV";
import { errorHandler, notFoundHandler } from "./app/middlewares/ErrorHandler";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

//* Importing routers
import problemRouter from "./app/routes/ProblemRouter";

class App {
  public app: Application;

  constructor() {
    validateEnv(), (this.app = express());

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeDatabase();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("combined"));
  }

  private initializeRoutes(): void {
    this.app.use("/", problemRouter);
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private initializeDatabase(): void {
    connectDB();
  }

  public listen(): void {
    this.app.listen(env.PORT, () =>
      console.log(`Server running on http://localhost:${env.PORT}`)
    );
  }
}

const app = new App()
app.listen()