import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

function ensureUrl(base: string | undefined): string {
  if (!base) return 'https://amthelper.vercel.app';
  const trimmed = base.trim().replace(/\/+$/, '');
  return trimmed.startsWith('http://') || trimmed.startsWith('https://')
    ? trimmed
    : `https://${trimmed}`;
}

export async function POST(request: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });
    const cookieHeader = request.headers.get('cookie') || '';
    const authToken = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('auth_token='))
      ?.split('=')[1]?.trim();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let userId: string;
    let userEmail: string;

    if (!authToken) {
      let supabaseUser: any = null;
      // Попробовать нативные Supabase куки (Google OAuth)
      const sbCookie = cookieHeader
        .split(';')
        .find(c => c.trim().includes('sb-') && c.trim().includes('-auth-token'))
        ?.split('=').slice(1).join('=')?.trim();
        
      if (sbCookie) {
        try {
          const decoded = JSON.parse(decodeURIComponent(sbCookie));
          const accessToken = Array.isArray(decoded) ? decoded[0] : decoded?.access_token;
          if (accessToken) {
            const { data: { user } } = await supabase.auth.getUser(accessToken);
            if (user) supabaseUser = user;
          }
        } catch {}
      }
      
      if (!supabaseUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      userId = supabaseUser.id;
      userEmail = supabaseUser.email!;
    } else if (authToken.startsWith('demo_token_')) {
      userId = '219d0e4d-401e-405a-b5be-ef1095f6165e';
      userEmail = 'demo@amthelper.de';
    } else {
      const { data: { user }, error } = await supabase.auth.getUser(authToken);
      if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      userId = user.id;
      userEmail = user.email!;
    }

    const body = await request.json().catch(() => ({}));
    const locale = body.locale || 'de';

    const { data: profile } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId },
      });
      customerId = customer.id;

      await supabase
        .from('users')
        .upsert({ id: userId, stripe_customer_id: customerId });
    }

    const appUrl = ensureUrl(process.env.NEXT_PUBLIC_APP_URL);

    const priceId = process.env.STRIPE_PRICE_PRO;
    if (!priceId) {
      return NextResponse.json({ error: 'STRIPE_PRICE_PRO is not configured' }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/${locale}/modules/billing?success=true`,
      cancel_url: `${appUrl}/${locale}/modules/billing?canceled=true`,
      metadata: { userId, userEmail, locale },
    });

    if (!session.url) {
      return NextResponse.json({ error: 'No checkout URL from Stripe' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
