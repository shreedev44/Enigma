export const env = {
	get PORT() {
		return process.env.PORT!;
	},
	get SMTP_USER() {
		return process.env.SMTP_USER!;
	},
	get SMTP_PASS() {
		return process.env.SMTP_PASS!;
	},
};
