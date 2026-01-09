import { Request, Response, NextFunction } from "express";
import { getAllOrders } from "../services/admin-orders.service";

export async function getOrdersHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
}
