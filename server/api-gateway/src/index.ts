import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import { env, validateEnv } from "./configs/envConfig";
import cors from "cors";
import morgan from "morgan";
import verifyToken from "./middleware/verifyToken";
import helmet from "helmet";

dotenv.config();
validateEnv();

const app = express();

const services = [
  {
    route: "/auth",
    target: env.AUTH,
  },
  {
    route: "/problem",
    target: env.PROBLEM
  }
];

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin as string)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use((req, res, next) => {
  verifyToken(req, res, next)
})

app.use(morgan("combined"));

app.use(helmet())

services.forEach((service) => {
  app.use(
    service.route,
    createProxyMiddleware({
      target: service.target,
      changeOrigin: true,
    })
  );
});


app.listen(env.PORT, () => console.log(`API gateway listening to ${env.PORT}`));
