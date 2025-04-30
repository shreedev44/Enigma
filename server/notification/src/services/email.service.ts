import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { env } from "../configs/env.config";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASS,
	},
});

export const sendEmail = async ({
	to,
	subject,
	templateName,
	templateData,
}: {
	to: string;
	subject: string;
	templateName: string;
	templateData: Record<string, any>;
}) => {
	const filePath = path.join(__dirname, `../templates/${templateName}.hbs`);
	const source = fs.readFileSync(filePath, "utf8");
	const compiledTemplate = handlebars.compile(source);
	const html = compiledTemplate(templateData);

	await transporter.sendMail({
		from: '"Enigma" <no-reply@enigma.com>',
		to,
		subject,
		html,
	});
};
