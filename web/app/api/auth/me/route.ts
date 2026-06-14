import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    if (!supabaseAdmin) {
      console.error('supabaseAdmin not configured - missing SUPABASE_SERVICE_ROLE_KEY');
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // First check if it's a demo token
    if (authToken.startsWith('demo_token_')) {
      const demoUser = {
        id: authToken,
        email: 'demo@amthelper.de',
        full_name: 'Demo User',
        role: 'pro',
        subscription_status: 'active',
        created_at: new Date().toISOString(),
      };
      return NextResponse.json({ user: demoUser }, { status: 200 });
    }

    // Real token - try to get user from Supabase Auth
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authToken);

    if (authError || !user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Get profile from users table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || user.user_metadata?.full_name || 'User',
        role: profile?.tier || profile?.role || 'free',
        subscription_status: profile?.stripe_customer_id ? 'active' : 'none',
        created_at: profile?.created_at || user.created_at,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
