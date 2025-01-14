import { env } from "./ENV";
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.USER_EMAIL,
    pass: env.USER_PASS,
  },
});