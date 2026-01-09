import { Router, Request, Response, NextFunction } from "express";
import { getOrdersHandler } from "../controllers/admin-orders.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { updateOrderStatus } from "../services/order-status.service";

const router = Router();

// later you can add role check: ADMIN
router.get("/orders", authMiddleware, getOrdersHandler);
router.patch(
  "/orders/:id/status",
  authMiddleware,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await updateOrderStatus(req.params.id, req.body.status);
      res.json({ message: "Status updated" });
    } catch (err) {
      next(err);
    }
  }
);


export default router;
