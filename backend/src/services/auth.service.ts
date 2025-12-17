import bcrypt from "bcrypt";
import { supabase } from "../db/supabaseClient";
import { UserDTO } from "./types";

interface RegisterInput {
  email: string;
  password: string;
  address?: string;
  phone?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export async function registerUser(input: RegisterInput) {
  const { email, password, address, phone } = input;

  // Check if user exists
  const { data: existingUser, error: selectError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existingUser) {
    const err: any = new Error("User with this email already exists");
    err.status = 409;
    throw err;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert({
      email,
      password: hashedPassword,
      address: address || null,
      phone_number: phone || null,
      role: "customer",
    })
    .select("id, email, role, address, phone_number, created_at")
    .single();

  if (insertError || !newUser) throw insertError || new Error("Insert failed");

  return newUser as UserDTO; // ✅ only return the user
}

export async function loginUser({ email, password }: LoginInput) {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, role, password, address, phone_number, created_at")
    .eq("email", email)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      const err: any = new Error("No user with this email exists");
      err.status = 404;
      throw err;
    }
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err: any = new Error("Incorrect password");
    err.status = 401;
    throw err;
  }

  // Remove password before returning
  const { password: _, ...userData } = user;

  return userData as UserDTO;
}

export async function getUserById(userId: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, role, address, phone_number, created_at")
    .eq("id", userId)
    .single();

  if (error || !user) {
    const err: any = new Error("Not authorized");
    err.status = 401;
    throw err;
  }

  return user as UserDTO;
}


export async function emailExists(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;

  return Boolean(data);
}

