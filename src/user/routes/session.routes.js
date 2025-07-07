import { Router } from "express";
import {refreshTokenSchema} from "../validations/session.validation.js"
import {handleRefreshToken} from "../controllers/session.controller.js"

const router = Router();

router.post("refresh-token", refreshTokenSchema, handleRefreshToken);
export default router;