import { supabase } from './supabaseClient';

// Example: get all users
export async function getAllUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw new Error(error.message);
  return data;
}
