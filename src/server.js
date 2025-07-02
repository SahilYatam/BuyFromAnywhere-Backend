import logger from "./shared/utils/logger.js";
import mongoose from "mongoose";


import { alertingService } from "./shared/errorMonitoring/alertingService.js";

export const createServer = async ({  app, port, serviceName, connectDB }) => {
  let httpServer;

  try {
    if (connectDB) {
      logger.info(`🔌 Connecting DB for ${serviceName}...`);
      await connectDB();
      logger.info("✅ DB connected.");
    }

    httpServer = app.listen(port, () => {
      logger.info(`${serviceName} running on PORT: ${port}`);
    });
    
  } catch (error) {
    logger.error(`Failed to start ${serviceName}: ${error.message}`);
  }

  // Global error handlers
  process.on("uncaughtException", async (error) => {
    await sendAlertAndShutdown("uncaughtException", error, serviceName);
  });

  process.on("unhandledRejection", async (reason, promise) => {
    logger.error("Reason:", reason);
    logger.error("Promise:", promise);
    const error = reason instanceof Error ? reason : new Error(String(reason));
    await sendAlertAndShutdown("unhandledRejection", error, serviceName);
  });

  process.on("SIGTERM", async () => {
    logger.info(`${serviceName} Recived SIGTERM, shutting down gracefully...`);
    await shutdown(httpServer);
  });

  process.on("SIGINT", async () => {
    logger.info(`${serviceName} Recived SIGINT (Ctr+C), shutting down...`);
    await shutdown(httpServer);
  });
};

const sendAlertAndShutdown = async (type, error, serviceName) => {
  logger.error(`🚨 ${type.toUpperCase()} DETECTED in ${serviceName}`);
  logger.error(error.stack);

  try {
    await alertingService.sendCriticalAlert(error, {
      severity: "critical",
      service: serviceName,
      additionalData: {
        processId: process.pid,
        errorType: type,
        memoryUsage: process.memoryUsage(),
      },
    });
  } catch (err) {
    logger.error(`❌ Failed to send alert: ${err.message}`);
  }

  setTimeout(() => {
    logger.info(`[${serviceName}] 💀 Process exiting due to ${type}`);
    process.exit(1);
  }, 2000);
};

const shutdown = async (httpServer) => {
  httpServer?.close(() => logger.info("🛑 HTTP server closed"));

  await mongoose.connection.close();
  logger.info("🛑 MongoDB connection closed");
  process.exit(0);
};
   