import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';
  const locale = searchParams.get('locale') || 'de';

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // Create user profile if not exists
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (serviceKey) {
        const admin = createClient(supabaseUrl, serviceKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        await admin
          .from('users')
          .upsert([
            {
              id: data.user.id,
              email: data.user.email || '',
              tier: 'free',
            },
          ]);
      }

      // Redirect to dashboard with locale
      const redirectUrl = new URL(`/${locale}${next}`, origin);
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set('auth_token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }
  }

  // Redirect to signin with error
  const signInUrl = new URL(`/${locale}/auth/signin?error=oauth`, origin);
  return NextResponse.redirect(signInUrl);
}
