import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import { env, validateEnv } from "./configs/env.config";
import cors from "cors";
import verifyToken from "./middleware/verify-token.middleware";
import helmet from "helmet";
import { initRedisClient } from "./configs/redis.config";
import morganLogger from "./loggers/morgan.logger";

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
		target: env.PROBLEM,
	},
];

const allowedOrigins = [
	"http://localhost:5173",
	"https://enigma-riddles.vercel.app",
];

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
	verifyToken(req, res, next);
});

app.use(morganLogger);

app.use(helmet());

services.forEach((service) => {
	app.use(
		`/api${service.route}`,
		createProxyMiddleware({
			target: service.target,
			changeOrigin: true,
		})
	);
});

initRedisClient();

app.listen(env.PORT, () => console.log(`API gateway listening to ${env.PORT}`));
