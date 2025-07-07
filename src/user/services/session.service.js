import { sessionModel } from "../models/session.model.js";
import {ApiError} from "../../shared/utils/ApiError.js"
import logger from "../../shared/utils/logger.js";

import jwt from "jsonwebtoken"
import { generateTokens } from "../../shared/utils/setCookiesAndToken.js";

export const sessionService = (connection) => {
  const Session = sessionModel(connection);

  const logLoginActivity = async (userId, ip, userAgent, refreshToken) => {
    try {
      await Session.create({
        userId,
        ip,
        userAgent,
        refreshToken,
        isValid: true,
      });
    } catch (error) {
        logger.error("Error in logLoginActivity: ", {message: error.message, stack: error.stack});
    }
  };

  const refreshAccessToken = async (refreshToken) =>{
    try {
        const token = await Session.findOne({refreshToken, isValid: true});
        if(!token) throw new ApiError(401, "Invalid request or Token expired");

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

        const {accessToken, refreshToken: newRefreshToken} = generateTokens(decoded.userId);

        await Session.findByIdAndDelete(token._id);
        await logLoginActivity(decoded.userId, token.ip, token.userAgent, newRefreshToken);

        return {accessToken, newRefreshToken};

    } catch (error) {
        logger.error("Error in refreshAccess Token", {message: error.message, stack: error.stack});
        throw new ApiError(500, "Failed to refresh access token");
    }
  }

  const cleanExpiredSession = async () => {
    const sevenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
    
    try {
        const result = await Session.deleteMany({
            createdAt: {$lt: sevenDaysAgo},
            isValid: false
        });
        logger.log(`🧹 Clean up ${result.deletedCount} expried sessions`)
    } catch (error) {
        logger.error("❌ Failed to clean expired sessions:", {message: error.message, stack: error.stack});
    }
    
  }

  return { logLoginActivity, cleanExpiredSession, refreshAccessToken };
};

export const getClientIp = (req) => {
    const xForwardedFor = req.headers["x-forwarded-for"];

    if(xForwardedFor){
        return xForwardedFor.split(',')[0].trim();
    };

    return req.conntection?.remoteAddress || req.socket?.remoteAddress || null;
}

