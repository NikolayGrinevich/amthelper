import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * Обработчик Stripe webhook untuk подписок
 * Слушает: customer.subscription.created, customer.subscription.updated, customer.subscription.deleted
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') || '';

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  console.log(`✓ Processing webhook event: ${event.type}`);

  const data = event.data.object as any;

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const sessionData = event.data.object as Stripe.Checkout.Session;
        const customerEmail =
          sessionData.customer_email ||
          sessionData.customer_details?.email;

        if (customerEmail) {
          await supabase
            .from('users')
            .update({
              tier: 'pro',
              stripe_customer_id: sessionData.customer as string,
              updated_at: new Date().toISOString(),
            })
            .eq('email', customerEmail);
          console.log(`✓ User ${customerEmail} upgraded to pro, customer: ${sessionData.customer}`);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        // Обнови подписку в БД
        await supabase
          .from('user_subscriptions')
          .upsert({
            stripe_customer_id: data.customer,
            stripe_subscription_id: data.id,
            stripe_price_id: data.items.data[0].price.id,
            status: data.status,
            current_period_start: new Date(data.current_period_start * 1000).toISOString(),
            current_period_end: new Date(data.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'stripe_subscription_id',
          });
        console.log(`✓ Subscription ${data.id} synced`);
        break;

      case 'customer.subscription.deleted':
        // Отмени подписку в БД
        await supabase
          .from('user_subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', data.id);
        console.log(`✓ Subscription ${data.id} canceled`);
        break;

      case 'invoice.payment_succeeded':
        // Invoice оплачен
        console.log(`✓ Invoice ${data.id} succeeded`);
        break;

      case 'invoice.payment_failed':
        // Invoice не оплачен
        console.log(`⚠️ Invoice ${data.id} failed`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error('Error processing webhook:', err);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
