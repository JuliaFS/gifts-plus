import { Router } from "express";
import { getAdminOrders } from "../controllers/admin-orders.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

router.get("/admin/orders", authMiddleware, adminOnly, getAdminOrders);

export default router;
