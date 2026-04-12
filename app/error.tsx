"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <h2 className="text-xl font-bold text-gray-200">Er ging iets mis</h2>
      <p className="text-gray-400 text-sm">{error.message}</p>
      <button
        onClick={reset}
        className="bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
      >
        Probeer opnieuw
      </button>
    </div>
  );
}
