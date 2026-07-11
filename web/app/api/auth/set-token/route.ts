import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // ── Origin check ──────────────────────────────────────────────
    const origin = request.headers.get('origin');
    if (origin) {
      const allowed = new Set<string>();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (appUrl) {
        try {
          allowed.add(new URL(appUrl.trim().replace(/\/+$/, '')).origin);
        } catch {}
      }
      allowed.add('https://amthelper.vercel.app');
      if (process.env.NODE_ENV !== 'production') {
        allowed.add('http://localhost:3000');
      }
      if (!allowed.has(origin)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // ── Parse body ───────────────────────────────────────────────
    const body = await request.json().catch(() => null);
    const accessToken: string | undefined = body?.accessToken;

    if (!accessToken || typeof accessToken !== 'string') {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      console.error('set-token: supabaseAdmin not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // ── Validate token with Supabase ─────────────────────────────
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // ── Decode JWT exp (signature already verified by getUser) ───
    let exp: number | null = null;
    try {
      const parts = accessToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(
          Buffer.from(parts[1], 'base64url').toString('utf-8')
        );
        if (typeof payload.exp === 'number') {
          exp = payload.exp;
        }
      }
    } catch {}

    if (!exp) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const remainingSeconds = exp - nowSec;

    if (remainingSeconds <= 0) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }
    if (remainingSeconds < 60) {
      return NextResponse.json(
        { error: 'Token expires too soon' },
        { status: 401 }
      );
    }

    // ── User profile: safe create-or-update ──────────────────────
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!existing) {
      // New user — insert with tier: 'free'
      const { error: insertError } = await supabaseAdmin
        .from('users')
        .insert([{ id: user.id, email: user.email || '', tier: 'free' }]);

      if (insertError) {
        console.error('set-token: profile insert error (non-blocking):', insertError.message);
      }
    } else {
      // Existing user — update email only, preserve all other fields
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ email: user.email || '' })
        .eq('id', user.id);

      if (updateError) {
        console.error('set-token: profile email update error (non-blocking):', updateError.message);
      }
    }

    // ── Set cookie ────────────────────────────────────────────────
    const maxAge = Math.min(remainingSeconds, 604800); // 604800 = 7 days upper bound

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email || '' },
    });

    response.cookies.set('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('set-token: unexpected error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
