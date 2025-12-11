import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../db/supabaseClient"; // import your Supabase client

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, address, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // 1. Check if user already exists
    const { data: existingUsers, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (selectError) throw selectError;

    if (existingUsers?.length) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert new user into Supabase
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
          address: address || null,       // optional
          phone_number: phone || null,    // optional
        },
      ])
      .select("id, email, address, phone_number, created_at")
      .single();

    if (insertError) throw insertError;

    res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Registration error:", error.message || error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // 1. Find the user by email
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") { // “no rows found” error from Supabase
        return res.status(404).json({ message: "No user with this email exists" });
      }
      throw error;
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // 3. Create JWT
    const jwtSecret = process.env.JWT_SECRET!;
    const payload = { user: { id: user.id, email: user.email } };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    res.json({ token });
  } catch (err: any) {
    console.error("Login error:", err.message || err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export default router;
