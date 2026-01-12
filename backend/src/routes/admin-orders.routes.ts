import { Router, Request, Response, NextFunction } from "express";
import { getOrdersHandler } from "../controllers/admin-orders.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { updateOrderStatus } from "../services/order-status.service";
import { OrderStatus } from "../utils/orderStatus";

const router = Router();

// later you can add role check: ADMIN
router.get("/orders", authMiddleware, getOrdersHandler);

router.patch(
  "/orders/:id/status",
  authMiddleware,
  async (
    req: Request<{ id: string }, any, { status: OrderStatus }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { status } = req.body;

      // Validate status
      if (!status || (status !== "SHIPPED" && status !== "CANCELLED" && status !== "PENDING")) {
        return res.status(400).json({ message: "Invalid status" });
      }

      await updateOrderStatus(req.params.id, status);

      res.json({ message: "Status updated" });
    } catch (err) {
      next(err);
    }
  }
);



export default router;
