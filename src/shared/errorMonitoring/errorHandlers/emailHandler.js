import { emailTemplate } from "./emailTemplate.js";
import logger from "../../utils/logger.js";

export const sendEmailAlert = async function (alertData){
  try {
    const htmlContent = emailTemplate(alertData);

    const mailOptions = {
      from: this.config.email.from,
      to: this.config.email.to,
      subject: `🚨 CRITICAL: ${alertData.appName} Error in ${alertData.environment}`,
      html: htmlContent,
      priority: "high",
    };

    await this.emailTranspoter.sendMail(mailOptions);
    logger.info("✅ Email alert sent successfully");
  } catch (error) {
    logger.error("❌ Failed to send email alert:", error.message);
    throw error;
  }
};
