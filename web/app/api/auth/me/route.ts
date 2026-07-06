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
        tier: 'pro',
        pro_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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

    // Auto-create profile if missing (safety net — signup upsert may have failed)
    let profileData = profile;
    if (!profileData) {
      const { data: newProfile } = await supabaseAdmin
        .from('users')
        .upsert([{
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || (user.email ? user.email.split('@')[0] : 'User'),
          tier: 'free',
          subscription_status: 'none',
        }])
        .select()
        .maybeSingle();
      profileData = newProfile;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: profileData?.full_name || user.user_metadata?.full_name || 'User',
        role: profileData?.tier || profileData?.role || 'free',
        tier: profileData?.tier || 'free',
        pro_expires_at: profileData?.pro_expires_at || null,
        subscription_status: profileData?.stripe_customer_id ? 'active' : 'none',
        created_at: profileData?.created_at || user.created_at,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
