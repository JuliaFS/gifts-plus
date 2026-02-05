import { supabase } from "./supabaseClient";

export async function getAllUsers() {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw new Error(error.message);
  return data;
}
