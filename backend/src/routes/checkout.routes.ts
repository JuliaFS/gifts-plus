import { Router } from "express";
import { checkoutHandler, prepareCheckoutController } from "../controllers/checkout.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, checkoutHandler);
router.post("/prepare", authMiddleware,prepareCheckoutController);

export default router;

