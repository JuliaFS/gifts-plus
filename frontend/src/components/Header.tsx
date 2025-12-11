import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">MyApp</h1>
        <div>
          <Link href="/login" className="mr-4">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </nav>
    </header>
  );
}
