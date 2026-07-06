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

    // Demo token
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

    // Real token - validate with Supabase Auth
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

    // Safety net: auto-create profile if missing
    let profileData = profile;
    if (!profileData) {
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('users')
        .upsert([{
          id: user.id,
          email: user.email || '',
          tier: 'free',
        }])
        .select()
        .maybeSingle();

      if (createError) {
        console.error('Profile auto-create error:', createError);
      }
      profileData = newProfile;
    }

    // full_name is NOT a column in users table — use auth metadata or fallback
    const fullName = user.user_metadata?.full_name || (user.email ? user.email.split('@')[0] : 'User');

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: fullName,
        role: profileData?.tier || 'free',
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
