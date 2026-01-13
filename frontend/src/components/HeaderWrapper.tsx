'use client';

import { Suspense } from "react";
import Header from "./Header";

function HeaderFallback() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto">Loading...</div>
    </header>
  );
}

export default function HeaderWrapper() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <Header />
    </Suspense>
  );
}
