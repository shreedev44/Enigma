import winston from "winston";
import LokiTransport from "winston-loki";
import { env } from "../configs/env.config";

const winstonLogger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	defaultMeta: { service: "api-gateway" },
	transports: [
		new winston.transports.Console(),
		new LokiTransport({
			host: env.LOKI_HOST,
			labels: { job: "api-gateway" },
			json: true,
			batching: false,
			interval: 5000,
			format: winston.format.json(),
		}),
	],
});

export default winstonLogger;
