import { sessionService } from "../services/session.service.js";
import { setCookies } from "../../shared/utils/setCookiesAndToken.js";

export const handleRefreshToken = async(req, res, next) => {
    try {
        const session = sessionService(req.app.locals.db)
        const refreshToken = req.cookie
        const {accessToken, newRefreshToken} = await session.refreshAccessToken(refreshToken)

        setCookies(res, accessToken, newRefreshToken);

        return res.status(200).json({message: "Token refreshed successfully"});

    } catch (error) {
        next(error)
    }
};