"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <h1 className="text-4xl font-bold text-gray-200">404</h1>
      <p className="text-gray-400">Pagina niet gevonden.</p>
      <Link href="/" className="text-green-400 hover:text-green-300 underline text-sm">
        Terug naar home
      </Link>
    </div>
  );
}
