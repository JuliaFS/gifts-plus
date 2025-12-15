import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../db/supabaseClient";
import { emailExists } from "../auth/auth";

const router = Router();

const JWT_EXPIRES_IN = 60 * 60; // 1 hour in seconds

/**
 * REGISTER
 */
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, address, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const { data: existingUsers, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (selectError) throw selectError;

    if (existingUsers?.length) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
          address: address || null,
          phone_number: phone || null,
        },
      ])
      .select("id, email, address, phone_number, created_at")
      .single();

    if (insertError) throw insertError;

    // ✅ Create JWT token
    const jwtSecret = process.env.JWT_SECRET!;
    const payload = { user: { id: newUser.id, email: newUser.email } };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: JWT_EXPIRES_IN });

    // ✅ Set HttpOnly cookie - TO DO for production
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // only on HTTPS
    //   sameSite: "strict",
    //   maxAge: JWT_EXPIRES_IN * 1000, // in milliseconds
    // });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // localhost = no HTTPS
      sameSite: "lax", // ✅ ALLOW cross-site navigation
      maxAge: JWT_EXPIRES_IN * 1000,
    });

    return res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Registration error:", error.message || error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res
          .status(404)
          .json({ message: "No user with this email exists" });
      }
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const jwtSecret = process.env.JWT_SECRET!;
    const payload = { user: { id: user.id, email: user.email } };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: JWT_EXPIRES_IN });

    // ✅ Set HttpOnly cookie TO DO for production
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: JWT_EXPIRES_IN * 1000,
    // });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // localhost = no HTTPS
      sameSite: "lax", // ✅ ALLOW cross-site navigation
      maxAge: JWT_EXPIRES_IN * 1000,
    });

    return res.json({ message: "Login successful" });
  } catch (err: any) {
    console.error("Login error:", err.message || err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * CHECK EMAIL EXISTS
 */
router.get("/check-email", async (req: Request, res: Response) => {
  const email = req.query.email as string;

  if (!email) {
    return res
      .status(400)
      .json({ exists: false, message: "Email is required" });
  }

  try {
    const exists = await emailExists(email);
    return res.json({ exists });
  } catch (err) {
    console.error("Email check error:", err);
    return res.status(500).json({ exists: false, message: "Server error" });
  }
});

router.get("/me", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token; // read HttpOnly cookie

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const jwtSecret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, jwtSecret) as {
      user: { id: string; email: string };
    };

    // Optional: fetch user data from DB
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, address, phone_number, created_at")
      .eq("id", decoded.user.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    return res.json(user);
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }
});

// LOGOUT
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,

    secure: false, // localhost = no HTTPS

    sameSite: "lax",
  });
  console.log("✅ Logout successful - Cookie cleared");
  return res.json({ message: "Logged out successfully" });
});

export default router;

