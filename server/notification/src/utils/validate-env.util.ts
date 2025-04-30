import { env } from "../configs/env.config";

export function validateEnv() {
	if (!env.PORT) {
		throw new Error("PORT is not found in the env");
	}
	if (!env.SMTP_USER) {
		throw new Error("SMTP_USER is not found in the env");
	}
	if (!env.SMTP_PASS) {
		throw new Error("SMTP_PASS is not found in the env");
	}
}
