'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', fontFamily: 'sans-serif' }}>
        <h2>Etwas ist schiefgelaufen / Что-то пошло не так</h2>
        <button onClick={() => reset()} style={{ marginTop: 16, padding: '8px 24px', cursor: 'pointer' }}>
          Erneut versuchen
        </button>
      </body>
    </html>
  );
}
