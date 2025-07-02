import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import connectDatabase from "../shared/config/db.js";
import { createServer } from "../server.js";


console.log("📦 src/server.js started");

(async () => {
  try {
    console.log("🛠️ Calling createServer...");
    await createServer({
      app,
      port: process.env.PORT || 8000,
      serviceName: "User-Service",
      connectDB: () => connectDatabase(process.env.USER_DB_URI),
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
  }
})();