import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.routes";
import productRoutes from "./src/routes/product.routes";
import cartRoutes from "./src/routes/cart.routes";
import checkoutRoutes from "./src/routes/checkout.routes";
import adminOrdersRoutes from "./src/routes/admin-orders.routes";
import favoritesRoutes from "./src/routes/favorites.routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000" || "https://gifts-plus.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/admin", adminOrdersRoutes);
app.use("/api/favorites", favoritesRoutes);

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
);

export default app;
