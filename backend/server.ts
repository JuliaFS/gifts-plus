import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes";
import productRoutes from "./src/routes/product.routes";
import cartRoutes from "./src/routes/cart.routes";
import checkoutRoutes from "./src/routes/checkout.routes";
import adminOrdersRoutes from "./src/routes/admin-orders.routes";


dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // allow frontend
//app.use(cors());
app.use(express.json());
app.use(cookieParser()); // ✅ must be before routes

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/admin", adminOrdersRoutes);


//TO DO - may be remove
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   console.error(err);
//   res.status(500).json({
//     message: err.message || "Internal Server Error",
//   });
// });
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


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
