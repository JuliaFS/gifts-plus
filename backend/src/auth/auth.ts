import { supabase } from '../db/supabaseClient';
import bcrypt from 'bcrypt';



interface RegisterData {
  email: string;
  password: string;
  address?: string;
  phone?: string;
}

export async function registerUser({ email, password, address, phone }: RegisterData) {
  // Hash the password (if you really want to do it on the client)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert into users table
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        email,
        password: hashedPassword,
        address: address || null,
        phone_number: phone || null,
      },
    ])
    .select(); // returns inserted row

  if (error) {
    if (error.code === "23505") throw new Error("Email already exists");
    else throw new Error(error.message);
  }

  return data[0]; // newly created user
}


export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single(); // get a single row

  if (error) throw new Error('User not found');

  const user = data;
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) throw new Error('Invalid password');

  return { id: user.id, email: user.email };
}