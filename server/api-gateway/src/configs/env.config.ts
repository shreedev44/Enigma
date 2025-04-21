export const env = {
	get PORT() {
		return process.env.PORT!;
	},
	get AUTH() {
		return process.env.AUTH!;
	},
	get PROBLEM() {
		return process.env.PROBLEM;
	},
	get JOB() {
		return process.env.JOB;
	},
	get JWT_ACCESS_SECRET() {
		return process.env.JWT_ACCESS_SECRET!;
	},
	get REDIS_URL() {
		return process.env.REDIS_URL!;
	},
	get LOKI_HOST() {
		return process.env.LOKI_HOST!;
	},
};

export function validateEnv() {
	if (!env.PORT) {
		throw new Error("PORT is not found in the env");
	}
	if (!env.AUTH) {
		throw new Error("AUTH is not found in the env");
	}
	if (!env.PROBLEM) {
		throw new Error("PROBLEM is not found in the env");
	}
	if (!env.JOB) {
		throw new Error("JOB is not found in the env");
	}
	if (!env.JWT_ACCESS_SECRET) {
		throw new Error("JWT_ACCESS_SECRET is not found in the env");
	}
	if (!env.REDIS_URL) {
		throw new Error("REDIS_URL is not found in the env");
	}
	if (!env.LOKI_HOST) {
		throw new Error("LOKI_HOST is not found in the env");
	}
}
