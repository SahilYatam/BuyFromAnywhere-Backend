import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cron from "node-cron"
import cookieParser from "cookie-parser"

import errorHandler from "../shared/middlewares/errorHandler.js";
import notFoundHandler from "../shared/middlewares/notFoundHandler.js";
import { sessionService } from "./services/session.service.js";
import logger from "../shared/utils/logger.js";

import userRouter from "./routes/user.routes.js";
import sessionRouter from "./routes/session.routes.js";

const app = express();

// Security
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Body Parsers
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later."
});
app.use("/api/v1/user", limiter, userRouter);
app.use("/api/v1/session", limiter, sessionRouter);

// Error Handling
app.use(errorHandler);
app.use(notFoundHandler);

cron.schedule("0 0 * * *", () => {
    logger.log("⏰ Running session cleanup job...");
    const session = sessionService(app.locals.db)
    session.cleanExpiredSession();
})

export { app };