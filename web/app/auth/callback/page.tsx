'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CallbackHandler() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const attemptRef = useRef(0);

  // ── Safe locale ───────────────────────────────────────────────
  const VALID_LOCALES = ['de', 'ru', 'uk', 'ro', 'tr'];
  const rawLocale = searchParams.get('locale') || 'de';
  const locale = VALID_LOCALES.includes(rawLocale) ? rawLocale : 'de';

  // ── Safe next path (internal only) ───────────────────────────
  const rawNext = searchParams.get('next') || '/dashboard';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard';

  useEffect(() => {
    let cancelled = false;

    const handleCallback = async () => {
      attemptRef.current += 1;

      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Configuration missing');
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // detectSessionInUrl: true (default) — browser processes implicit OAuth fragment
        const { data: { session } } = await supabase.auth.getSession();

        if (cancelled) return;

        if (!session?.access_token) {
          // Retry up to 3 times with 500ms delay
          if (attemptRef.current < 3) {
            setTimeout(handleCallback, 500);
            return;
          }
          throw new Error('No session found');
        }

        // ── Send access token to server → set httpOnly cookie ────
        const res = await fetch('/api/auth/set-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: session.access_token }),
          credentials: 'include',
        });

        if (cancelled) return;

        if (!res.ok) {
          throw new Error('Token validation failed');
        }

        const data = await res.json();

        if (!data?.success) {
          throw new Error('Server rejected token');
        }

        // ── Full page reload to dashboard ───────────────────────
        // Full reload ensures cookie is read by middleware on next request
        window.location.href = `/${locale}${next}`;
      } catch {
        if (cancelled) return;
        setStatus('error');
        setTimeout(() => {
          window.location.href = `/${locale}/auth/signin?error=oauth`;
        }, 1000);
      }
    };

    handleCallback();

    return () => {
      cancelled = true;
    };
  }, [locale, next]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center gap-4">
        {status === 'loading' ? (
          <>
            <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-600 text-sm">Signing in...</p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 flex items-center justify-center text-red-500 text-2xl">⚠️</div>
            <p className="text-gray-600 text-sm">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
