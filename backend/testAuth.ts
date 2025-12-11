import { registerUser, loginUser } from "./src/auth/auth";

async function test() {
  try {
    const newUser = await registerUser('test@example.com', 'password123');
    console.log('Registered user:', newUser);

    const loggedIn = await loginUser('test@example.com', 'password123');
    console.log('Logged in user:', loggedIn);
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

test();

