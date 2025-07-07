import bcrypt from "bcrypt";
import crypto from "crypto";

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = (password, hashPass) => {
  return bcrypt.compare(password, hashPass);
};

const pick = (obj, keys) => {
    keys.reduce((result, key) => {
        if(obj.hasOwnProperty(key)){
            result[key] = obj[key]
        }
        return result;
    }, {})
};

const passwordResetToken = () => {
    const token = crypto.randomBytes(20).toString("hex");
    return token
}

const hashPasswordToken = (rawToken) => {
    const hashToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    return hashToken
}

export const helperFun={hashPassword, comparePassword, pick, passwordResetToken, hashPasswordToken}