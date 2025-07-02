import { AlertingService } from "./errorAlertingService.js";

export const alertingService = new AlertingService({
  // email configuration
  emailService: "gmail",
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailFrom: "alert@buyFromAnywhere.com",
  emailTo: "sahilyatam@9gmail.com",
  enbleEmail: true,

  // discord configuration
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
  enableDiscord: true, 

  // logging configuration
  logDirectory: "./logs",
  enableLogging: true,

  environment: process.env.NODE_ENV || "development",
  appName: "BuyFromAnywhere"
});

