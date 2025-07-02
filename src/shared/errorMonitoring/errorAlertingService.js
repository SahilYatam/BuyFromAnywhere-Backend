import nodemailer from "nodemailer";
import logger from "../utils/logger.js";

import { sendEmailAlert } from "./errorHandlers/emailHandler.js";
import { sendDiscordAlert } from "./errorHandlers/discordHandler.js";
import { logToFile, ensureLogDirectory } from "./errorHandlers/fileHandler.js";
import {
  prepareAlertData,
  handleAlertResults,
} from "./alertUtils/alertUtils.js";

// Handles multiple notification channels: Email, Discord and file logging

class AlertingService {
  constructor(config = {}) {
    this.config = {
      email: {
        service: config.emailService || "gmail",
        user: config.emailUser || process.env.EMAIL_USER,
        password: config.emailPassword || process.env.EMAIL_PASSWORD,
        from: config.emailFrom || "alert@buyFromAnywhere.com",
        to: config.emailTo || process.env.EMAIL_USER,
        enabled: config.enabledEmail !== false,
      },

      discord: {
        webhookUrl: config.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL,
        enabled: config.enabledDiscord !== false,
      },

      logging: {
        logDirectory: config.logDirectory || "./logs",
        enabled: config.enabledLogging !== false,
      },

      environment: config.environment || process.env.NODE_ENV || "development",
      appName: config.appName || "BuyFromAnywhere App",
    };

    // Initialize email transporter if email is enabled
    if (
      this.config.email.enabled &&
      this.config.email.user &&
      this.config.email.password
    ) {
      this.emailTranspoter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: process.env.NODEMAILER_PORT,
        service: this.config.email.service,
        auth: {
          user: this.config.email.user,
          pass: this.config.email.password,
        },
      });
    }

    this.prepareAlertData = prepareAlertData.bind(this);
    this.sendEmailAlert = sendEmailAlert.bind(this);
    this.sendDiscordAlert = sendDiscordAlert.bind(this);
    this.logToFile = logToFile.bind(this);
    this.ensureLogDirectory = ensureLogDirectory.bind(this);
    this.handleAlertResults = handleAlertResults.bind(this);

    if (this.config.logging.enabled) {
      this.ensureLogDirectory();
    }
  }

  // Main methos to send critical alerts through all configured channels

  async sendCriticalAlert(error, context = {}) {
    const alertData = this.prepareAlertData(error, context);
    const promises = [];

    logger.error(`🚨 CRITICAL ALERT: ${error.message}`);
    logger.error(`Stack trace: ${error.stack}`);

    // send through all enabled channels
    if (this.config.email.enabled && this.emailTranspoter) {
      promises.push(this.sendEmailAlert(alertData));
    }

    if (this.config.discord.enabled && this.config.discord.webhookUrl) {
      promises.push(this.sendDiscordAlert(alertData));
    }

    if (this.config.logging.enabled) {
      promises.push(this.logToFile(alertData));
    }

    // Execute all alearts and handle any failures
    const results = await Promise.allSettled(promises);
    this.handleAlertResults(results);

    return alertData;
  }

  // testing alert to verify configuration

  async sendTestAlert() {
    const testError = new Error(
      "This is a test alert to verify the alerting system is working correctly"
    );
    testError.name = "TestAlert";

    try {
      await this.sendCriticalAlert(testError, {
        severity: "test",
        service: "alerting-system-test",
        additionalData: {
          message:
            "If you receive this alert, your alerting system is configured correctly!",
        },
      });
      logger.info("🎉 Test alert sent successfully!");
    } catch (error) {
      logger.error("❌ Test alert failed:", error.message);
      throw error;
    }
  }
}

export { AlertingService };
