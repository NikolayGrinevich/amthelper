import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name } = await request.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Email and password (min 6 chars) required' },
        { status: 400 }
      );
    }

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || email.split('@')[0],
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Signup failed - no user created' },
        { status: 500 }
      );
    }

    // Create user profile in database using service role (bypasses RLS)
    // Only columns that exist in the live `users` table: id, email, tier, language, stripe_customer_id, pro_expires_at, created_at, updated_at
    if (!supabaseAdmin) {
      console.error('supabaseAdmin not available — SUPABASE_SERVICE_ROLE_KEY missing on server');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { error: profileError } = await supabaseAdmin
      .from('users')
      .upsert([
        {
          id: data.user.id,
          email: data.user.email || email,
          tier: 'free',
          // language omitted — DB default is 'ru'
        },
      ]);

    if (profileError) {
      // Return the error to the client — don't swallow it
      console.error('Profile creation error:', profileError);
      return NextResponse.json(
        {
          error: 'Account created in Auth but profile insert failed',
          details: profileError.message,
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      // If email confirmation is enabled in Supabase (which it is),
      // session is null and user must confirm email first.
      session: !!data.session,
    });

    // Set session cookie if session exists
    if (data.session) {
      response.cookies.set('auth_token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Signup failed' },
      { status: 500 }
    );
  }
}
