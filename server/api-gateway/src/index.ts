import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { env, validateEnv } from "./configs/env.config";

dotenv.config();
validateEnv();

import morganLogger from "./loggers/morgan.logger";
import { createProxyMiddleware } from "http-proxy-middleware";
import verifyToken from "./middleware/verify-token.middleware";
import { initRedisClient } from "./configs/redis.config";


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
