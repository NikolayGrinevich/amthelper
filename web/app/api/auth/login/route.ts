import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Demo credentials validation (temporary for development)
    const DEMO_EMAIL = process.env.DEMO_EMAIL || 'demo@amthelper.de';
    const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'AmtHelper#2026!';

    // Check for demo credentials first (development testing)
    console.log('[LOGIN DEBUG]', JSON.stringify({ email, pwLen: password?.length, demoEmail: DEMO_EMAIL, demoPwLen: DEMO_PASSWORD?.length, emailMatch: email === DEMO_EMAIL, pwMatch: password === DEMO_PASSWORD }));
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const demoUser = {
        id: 'user_demo_' + Math.random().toString(36).substr(2, 9),
        email,
        full_name: 'Demo User',
        role: 'pro',
        subscription_status: 'active',
        created_at: new Date().toISOString(),
      };

      const response = NextResponse.json({
        success: true,
        user: demoUser,
        mode: 'demo',
      });

      response.cookies.set('auth_token', 'demo_token_' + demoUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // Real login with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: 'Login failed' },
        { status: 500 }
      );
    }

    // Fetch user profile (best-effort; demo fallback handled below)
    let profileData: any = null;
    let schemaError: string | null = null;
    try {
      const profileResult = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
      profileData = profileResult.data;
      if (profileResult.error) schemaError = profileResult.error.message;
    } catch (e) {
      schemaError = e instanceof Error ? e.message : 'Unknown schema error';
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: (profileData as any)?.full_name || 'User',
        role: (profileData as any)?.tier || 'free',
        subscription_status: (profileData as any)?.stripe_customer_id ? 'active' : 'none',
      },
      mode: 'production',
    });

    response.cookies.set('auth_token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 }
    );
  }
}
