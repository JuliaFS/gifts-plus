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
      {
        user: { id: user.id, email: user.email, role: user.role || "customer" },
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // required for HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: JWT_EXPIRES_IN * 1000,
      path: "/", // important so cookie is sent to all API routes
    });

    return res.status(201).json(user); // ✅ only user, no token
  } catch (error) {
    next(error);
  }
}

export async function login(req: AuthRequest, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await authService.loginUser({ email, password });

    // Set JWT cookie
    const token = jwt.sign(
      {
        user: { id: user.id, email: user.email, role: user.role || "customer" },
      },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // required for HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: JWT_EXPIRES_IN * 1000,
      path: "/", // important so cookie is sent to all API routes
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

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await authService.forgotPassword(email);

    return res.status(200).json({
      message: "If the email exists, a reset link was sent",
    });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// export async function resetPassword(req: Request, res: Response) {
//   try {
//     const { token, password } = req.body;

//     if (!token || !password) {
//       return res.status(400).json({ message: "Invalid request" });
//     }

//     await authService.resetPassword(token, password);

//     return res.status(200).json({ message: "Password successfully reset" });
//   } catch (error: any) {
//     return res
//       .status(error.status || 500)
//       .json({ message: error.message });
//   }
// }

// export async function resetPassword(req: Request, res: Response) {
//   try {
//     const { token, password } = req.body;

//     if (!token || !password) {
//       return res.status(400).json({ message: "Invalid request" });
//     }

//     // 1. Reset the password and get the user data back
//     const user = await authService.resetPassword(token, password);

//     // 2. Generate the JWT (Matches your register/login logic)
//     const jwtToken = jwt.sign(
//       { user: { id: user.id, email: user.email, role: user.role || 'customer' } },
//       process.env.JWT_SECRET!,
//       { expiresIn: JWT_EXPIRES_IN }
//     );

//     // 3. Set the HttpOnly cookie
//     res.cookie("token", jwtToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: JWT_EXPIRES_IN * 1000,
//     });

//     // 4. Return success and the user object
//     return res.status(200).json({
//       message: "Password successfully reset",
//       user
//     });
//   } catch (error: any) {
//     return res
//       .status(error.status || 500)
//       .json({ message: error.message });
//   }
// }

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    }

    // 1. Service handles the DB logic and returns the UserDTO
    const user = await authService.resetPassword(token, password);

    // 2. Generate the JWT (using your existing logic)
    const jwtToken = jwt.sign(
      {
        user: { id: user.id, email: user.email, role: user.role || "customer" },
      },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 3. Set the HttpOnly cookie so the user is logged in instantly
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // required for HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: JWT_EXPIRES_IN * 1000,
      path: "/", // important so cookie is sent to all API routes
    });

    // 4. Send back the user data (frontend can now redirect to /dashboard)
    return res.status(200).json({
      message: "Password successfully reset",
      user,
    });
  } catch (error: any) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
}
