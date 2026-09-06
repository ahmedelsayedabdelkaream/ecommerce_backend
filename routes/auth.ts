import { Router } from "express";
import type { RequestHandler } from "express";
import * as authController from "../controllers/auth_controller.js";
const router = Router();

router.post("/login", authController.login as RequestHandler);
router.post("/refreshAccessToken", authController.refreshAccessToken);
router.post("/register", authController.register as RequestHandler);
router.post("/completeProfile", authController.completeProfile);
router.post("/sendOTP", authController.sendOTP);
router.post("/verifyEmailOTP", authController.verifyEmailOTP);
router.post("/verifyResetPasswordOTP", authController.verifyResetPassOTP);
router.post("/resetPassword", authController.resetPassword);
export default router;
