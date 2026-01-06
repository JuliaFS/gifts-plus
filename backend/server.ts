import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes";
import productRoutes from "./src/routes/product.routes";
import cartRoutes from "./src/routes/cart.routes";

dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // allow frontend
//app.use(cors());
app.use(express.json());
app.use(cookieParser()); // ✅ must be before routes

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

//TO DO - may be remove
app.use((err, res) => {
  console.error(err);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
