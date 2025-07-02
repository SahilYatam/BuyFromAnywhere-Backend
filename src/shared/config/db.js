import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDatabase = async (dbURI) => {
  if(!dbURI){
    logger.error("❌ MongoDB URI is missing.");
    process.exit(1);
  }

  let maxRetries = 5;
  let retryDelay = 5000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        retryWrites: true,
        retryReads: true,
      };
      const connect = await mongoose.connect(dbURI, options);

      logger.info(`Database connected to: ${connect.connection.host}`, {
        host: connect.connection.host,
        database: connect.connection.name,
        attempt: attempt,
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn("⚠️ MongoDB disconnected");
      });

      mongoose.connection.on("error", (error) => {
        logger.error(`❌ MongoDB connection failed: ${error.message}`);
      });

      return; //Success - exit the retry loop

    } catch (error) {
      logger.error(`MongoDB connection attempt ${attempt} failed`, {
        error: error.message,
        attempt: attempt,
        maxRetries: maxRetries,
        stack: error.stack,
      });

      // exit the process after 5 attempts
      if(attempt === maxRetries){
        logger.error("All MongoDB connection attempts failed. Exiting...");
        process.exit(1);
      }

      // wait before retrying
      logger.info(`Retrying in ${retryDelay}ms...(${attempt}/${maxRetries})`);
      
      await sleep(retryDelay);
      
    }
  }
};

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default connectDatabase;
