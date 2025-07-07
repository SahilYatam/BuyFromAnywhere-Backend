import { Router } from "express";
import { authentication } from "../../shared/middlewares/auth.middleware";
import {validateUser} from "../validations/user.validation.js"
import { validationSession } from "../validations/session.validation.js";
import {userController, injectUserService} from "../controllers/user.controller.js"


const router = Router();

router.use(injectUserService);

router.post("/signup", validateUser.signupSchema, validationSession, userController.signupUser);
router.post("/login", validateUser.loginSchema, validationSession, userController.loginUser);
router.post("/logout", authentication, validateUser.logoutSchema, userController.logoutUser);
router.put("/update-details", authentication, validateUser.updateSchema, userController.updateUserDetails);
router.get("/user-profile", authentication, userController.getUserProfile);

router.post("/forget-password", authentication, validateUser.forgetPasswordSchema, validateUser.forgetPasswordSchema);
router.post("/reset-password/:token", authentication, validateUser.resetPasswordSchema, userController.resetPassw);


export default router;