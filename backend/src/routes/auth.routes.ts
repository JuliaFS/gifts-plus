import { Router } from "express";
import {
  checkEmail,
  forgotPassword,
  resetPassword,
  getMe,
  login,
  logout,
  register,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { getResetTokenCookie } from "../services/auth.service";

const router = Router();

/**
 * REGISTER
 */
router.post("/register", register);

/**
 * LOGIN
 */
router.post("/login", login);

/**
 * CHECK EMAIL EXISTS
 */
router.get("/check-email", checkEmail);

/**
 * CHECK USER INFO
 */
router.get("/me", authMiddleware, getMe);

/**
 * FORGOT PASSORD
 */
router.post("/forgot-password", forgotPassword);
//router.get("/reset-token", getResetTokenCookie);
router.post("/reset-password", resetPassword);


// LOGOUT
router.post("/logout", logout);

export default router;
