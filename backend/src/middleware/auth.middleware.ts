import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: JwtUserPayload;
}

interface JwtUserPayload {
  id: string;
  email: string;
  role: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { user: JwtUserPayload };

    req.user = decoded.user; // ✅ always defined
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
