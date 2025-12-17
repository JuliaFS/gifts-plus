import { Router } from "express";
import {
  checkEmail,
  getMe,
  login,
  logout,
  register,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

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

router.get("/me", authMiddleware, getMe);

// LOGOUT
router.post("/logout", logout);

export default router;
