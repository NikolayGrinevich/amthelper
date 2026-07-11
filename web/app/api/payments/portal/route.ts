import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/app/lib/supabase';

const VALID_LOCALES = ['de', 'ru', 'uk', 'ro', 'tr'];

export async function POST(request: NextRequest) {
  try {
    // ── Auth: read httpOnly cookie ────────────────────────────────
    const authToken = request.cookies.get('auth_token')?.value;
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // ── Validate token with Supabase ──────────────────────────────
    const { data: { user }, error: authError } =
      await supabaseAdmin.auth.getUser(authToken);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Look up stripe_customer_id by user.id ────────────────────
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // ── Safe locale from body (optional) ─────────────────────────
    const body = await request.json().catch(() => ({}));
    const rawLocale = body?.locale || 'de';
    const locale = VALID_LOCALES.includes(rawLocale) ? rawLocale : 'de';

    // ── Create Billing Portal Session ────────────────────────────
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });

    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL || 'https://amthelper.vercel.app'
    ).replace(/\/+$/, '');
    const returnUrl = `${appUrl}/${locale}/modules/billing`;

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
