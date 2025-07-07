import jwt from "jsonwebtoken";
import {userModel} from "../../user/models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";

export const authentication = async (req, _, next) => {
  const User = userModel(req.app.locals.db);
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken)
      throw new ApiError(401, "Unauthorized - No access token provided");

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECERET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) throw new ApiError(404, "User not found");

    req.user = user;
    next();
  } catch (error) {
    logger.error("Error in authentication middleware code:", {message: error.message});
  }
};