import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoutes";

dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true, })); // allow frontend
//app.use(cors());
app.use(express.json());
app.use(cookieParser()); // ✅ must be before routes

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));