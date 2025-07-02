import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import errorHandler from "../middlewares/errorHandler.js";
import notFoundHandler from "../middlewares/notFoundHandler.js";

export const initializeApp = (cutomeRoutes) => {
  const app = express();

  // Security
  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));

  // Body Parsers
  app.use(express.json({ limit: "20kb" }));
  app.use(express.urlencoded({ extended: true }));

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
  });
  
  cutomeRoutes(app)

  // Error Handling
  app.use(errorHandler);
  app.use(notFoundHandler);

  return app;
};
