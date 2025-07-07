import { ApiError } from "../../shared/utils/ApiError.js";
import { userModel } from "../models/user.model.js";
import { sessionModel } from "../models/session.model.js";
import {helperFun} from "../../shared/utils/helperFunctions.js";

export const toPublicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    region: user.region,
    currency: user.currency,
});

export const userServiceFactory = (connection) => {
  const User = userModel(connection);
  const Session = sessionModel(connection);

  const signup = async (userBody) => {
    const existingUser = await User.findOne({ email: userBody.email.trim().toLowerCase() });
    if (existingUser) throw new ApiError(409,"An account with this email address already exists.");

    const hashedPassword = await helperFun.hashPassword(userBody.password);

    const createdUser = await User.create({
      ...userBody,
      email: userBody.email.trim().toLowerCase(),
      password: hashedPassword,
    });

    return toPublicUser(createdUser);
  };

  const login = async (userBody) => {
    const user = await User.findOne({ email: userBody.email.trim().toLowerCase() });
    if (!user) throw new ApiError( 404,"No account found with the provided email address.");

    const isMatch = await helperFun.comparePassword(
      userBody.password,
      user.password
    );
    if (!isMatch)
      throw new ApiError(401, "The provided password is incorrect.");

    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  };

  const getUser = async (userId) => {
    const user = await getUserById(userId);
    if (!user) throw new ApiError(404, "User not found");

    return toPublicUser(user);
  };

  const getUserById = async (id) => {
    return User.findById(id).seletc("-password");
  };

  const updateUser = async (userId, updateData) => {
    const allowedFields = ["name", "region", "currency"];
    const sanitizedUpdate = helperFun.pick(updateData, allowedFields);

    const user = await getUserById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const updatedData = await User.findByIdAndUpdate(userId, sanitizedUpdate, {
      new: true,
    }).lean();

    return toPublicUser(updatedData);
  };

  const logout = async (userId, refreshToken) => {
    const session = await Session.findOne({userId, refreshToken, isValid: true});
    if(!session) throw new ApiError(404, "Session not found");

    session.isValid = false
    session.refreshToken = null
    await session.save();

    return {};
  };

  const forgetPassword = async (userBody) => {
    const user = await User.findOne({email: userBody.email.trim().toLowerCase()});
    if(!user) throw new ApiError(404, "User does not exist");

    const rawToken = helperFun.passwordResetToken();
    const resetPasswExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    const hashedToken = helperFun.hashPasswordToken(rawToken)

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiresAt = resetPasswExpiresAt;

    await user.save();
    return {email: user.email, rawToken, userId: user._id};
  }

  const resetPassword = async(token, userBody) => {
    const hashedToken = helperFun.hashPasswordToken(token)
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpiresAt: {$gt: Date.now()}
    });

    if(!user) throw new ApiError(403, "Invalid or Expired reset token");

    const newPassword = await helperFun.hashPassword(userBody.password);

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    return {email: user.email, userId: user._id};
  }

  return {
    signup,
    login,
    getUser,
    updateUser,
    logout,
    forgetPassword,
    resetPassword
  };
};

/**
 * @typedef {ReturnType<typeof userServiceFactory>} userServiceType
 */