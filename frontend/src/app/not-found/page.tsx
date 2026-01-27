

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-800">
      <h1 className="text-6xl font-extrabold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}