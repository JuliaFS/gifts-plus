import { Router } from "express";
import { checkoutHandler, prepareCheckoutController, verifyPaymentController } from "../controllers/checkout.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, checkoutHandler);
router.post("/prepare", authMiddleware,prepareCheckoutController);
router.post("/verify-payment", verifyPaymentController);

export default router;
