import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { ApiError } from "../../shared/utils/ApiError.js";

import { userServiceFactory } from "../services/user.service.js";
import { sessionService } from "../services/session.service.js";

import { generateTokens, setCookies } from "../../shared/utils/setCookiesAndToken.js";
import { getClientIp } from "../services/session.service.js";
import { sendPasswordResetEmail, sendResetSuccessEmail } from "../../shared/email/email.js";

export const injectUserService = (req, res, next) => {
    req.userService = userServiceFactory(req.app.locals.db)
    next();
}

/**
 * @type {import('../services/user.service.js').userServiceType}
 */

const signupUser = asyncHandler(async(req, res) => {
    const userService = userServiceFactory(req.app.locals.db);
    // const userService = req.userService;
    const session = sessionService(req.app.locals.db);

    const user = await userService.signup(req.body);

    const {accessToken, refreshToken} =  generateTokens(user.id);

    const ip = await getClientIp(req)
    const userAgent = req.headers["user-agent"] || "unknown";
    await session.logLoginActivity(user.id, ip, userAgent, refreshToken);
        
    setCookies(res, accessToken, refreshToken);

    return res.status(201).json(new ApiResponse(201, {user}, "User signed up successfully."));
});

const loginUser = asyncHandler(async(req, res) => {
    const userService = userServiceFactory(req.app.locals.db);
    const session = sessionService(req.app.locals.db);
    const user = await userService.login(req.body);

    const {accessToken, refreshToken} =  generateTokens(user.id);
    setCookies(res, accessToken, refreshToken);


    const ip = await getClientIp(req)
    const userAgent = req.headers["user-agent"] || "unknown";
    await session.logLoginActivity(user.id, ip, userAgent, refreshToken);

    return res.status(200).json(new ApiResponse(200, {user}, "User logged in successfully"));
});

const updateUserDetails = asyncHandler(async(req, res) => {
    const userService = userServiceFactory(req.app.locals.db);
    const updatedUser = await userService.updateUser(req.user?._id, res.body);
    return res.status(200).json(new ApiResponse(200, {updatedUser}, "User details updated successfully."))
});

const logoutUser = asyncHandler(async(req, res) => {
    const userService = userServiceFactory(req.app.locals.db);
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) throw new ApiError(400, "Refresh token is missing");

    await userService.logout(req.user?._id, refreshToken);

    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    return res.status(200).json(new ApiResponse(200, {}, "User logged out successfully."))
});

const getUserProfile = asyncHandler(async(req, res) => {
    const userService = userServiceFactory(req.app.locals.db);
    const user = await userService.getUser(req.user?._id);

    return res.status(200).json(new ApiResponse(200, {user}, "User profile"));
})

const forgetPassw = asyncHandler(async(req, res) => {
    const userService = userServiceFactory(req.app.locals.db);
    const user = await userService.forgetPassword(req.body);

    await sendPasswordResetEmail(user.email,
        `${process.env.CLIENT_URL}/reset-password/${user.rawToken}`
    );
    logger.info("Password reset link generated from this Id:", { userId: user.userId });
    return res.status(200).json(new ApiResponse(200, {}, "Password reset link sent to your email"));
});

const resetPassw = asyncHandler(async(req, res) => {
    const {token} = req.params;
    const userService = userServiceFactory(req.app.locals.db);
    const user = await userService.resetPassword(token, req.body)

    await sendResetSuccessEmail(user.email);

    logger.info("Password reset successful from this Id: ", { userId: user.userId });
    return res.status(200).json(new ApiResponse(200, {}, "Password reset successfull"));
})

export const userController = {
    signupUser,
    loginUser,
    updateUserDetails,
    logoutUser,
    getUserProfile,
    forgetPassw,
    resetPassw
}