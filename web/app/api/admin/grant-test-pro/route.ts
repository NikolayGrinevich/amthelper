import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Admin auth check
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_KEY;
    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Find user by email
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, tier')
      .eq('email', email)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Grant test Pro: tier='pro', pro_expires_at = now + 30 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        tier: 'pro',
        pro_expires_at: expiresAt.toISOString(),
      })
      .eq('id', userData.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      email: userData.email,
      tier: 'pro',
      pro_expires_at: expiresAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to grant Pro' },
      { status: 500 }
    );
  }
}
