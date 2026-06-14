'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-2 text-2xl font-semibold">Etwas ist schiefgelaufen / Что-то пошло не так</h2>
      <p className="mb-6 text-gray-500">
        {error.digest ? `Fehlercode: ${error.digest}` : 'Ein unerwarteter Fehler ist aufgetreten.'}
      </p>
      <button
        onClick={() => reset()}
        className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Erneut versuchen / Попробовать снова
      </button>
    </div>
  );
}
