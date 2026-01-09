import { Router } from "express";
import { checkoutHandler } from "../controllers/checkout.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, checkoutHandler);

export default router;

