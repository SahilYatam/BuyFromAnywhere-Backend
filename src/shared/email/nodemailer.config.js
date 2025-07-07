import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: process.env.NODEMAILER_PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SENDER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});
