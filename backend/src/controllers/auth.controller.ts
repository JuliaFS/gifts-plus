import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as authService from "../services/auth.service";
import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN || 3600);

export async function register(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, address, phone } = req.body;

    const user = await authService.registerUser({
      email,
      password,
      address,
      phone,
    });

    // Set JWT cookie
    const token = jwt.sign(
      { user: { id: user.id, email: user.email, role: user.role || 'customer' } },
      process.env.JWT_SECRET!,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: JWT_EXPIRES_IN * 1000,
    });

    return res.status(201).json(user); // ✅ only user, no token
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: AuthRequest,
  res: Response
) {
  try {
    const { email, password } = req.body;

    const user = await authService.loginUser({ email, password });

    // Set JWT cookie
    const token = jwt.sign(
      { user: { id: user.id, email: user.email, role: user.role || 'customer' } },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: JWT_EXPIRES_IN * 1000,
    });

    return res.status(200).json(user); // ✅ only user, no token
  } catch (error: unknown) {
    console.error(error);

    // Respect status if provided by the service
    let status = 500;
    let message = "Internal Server Error";

    if (error instanceof Error) {
      message = error.message;
      // @ts-ignore
      if ((error as any).status) {
        // use status from loginUser errors
        status = (error as any).status;
      }
    }

    return res.status(status).json({ message });
  }
}


export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await authService.getUserById(req.user!.id);
    return res.status(200).json(user); // ✅ same format
  } catch (error) {
    next(error);
  }
}

export function logout(req: AuthRequest, res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
}

export async function checkEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const email = req.query.email as string | null;

    if (!email) {
      return res
        .status(400)
        .json({ exists: false, message: "Email is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ exists: false, message: "Invalid email format" });
    }

    const exists = await authService.emailExists(email);

    return res.status(200).json({ exists });
  } catch (error) {
    next(error);
  }
}
