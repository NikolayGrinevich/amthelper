import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * Обработчик Stripe webhook für Подписок
 * Слушает: checkout.session.completed, customer.subscription.*, invoice.*
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') || '';
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
        const customerId = sessionData.customer as string;
        const userId = sessionData.metadata?.userId;
        const userEmail = sessionData.metadata?.userEmail
          || sessionData.customer_email
          || sessionData.customer_details?.email;

        if (userId) {
          await supabase.from('users')
            .update({
              tier: 'pro',
              stripe_customer_id: customerId,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
          console.log(`✓ User ${userId} upgraded to pro via metadata.userId`);
        } else if (userEmail) {
          await supabase.from('users')
            .update({
              tier: 'pro',
              stripe_customer_id: customerId,
              updated_at: new Date().toISOString(),
            })
            .eq('email', userEmail);
          console.log(`✓ User ${userEmail} upgraded to pro via email fallback`);
        } else {
          console.log('✗ No userId or userEmail found in session metadata');
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const customerId = data.customer as string;
        const subscriptionId = data.id as string;

        if (!customerId || !subscriptionId) {
          console.log(`⚠️ customer.subscription.updated: missing customer or id — ${event.type}`);
          break;
        }

        // Stripe может слать статусы 'incomplete', 'trialing', 'active', 'past_due', 'canceled', 'unpaid'
        // Маппим в разрешённые БД
        const allowedStatuses = ['none', 'active', 'past_due', 'canceled'];
        const rawStatus = (data.status as string) || 'none';
        const dbStatus = allowedStatuses.includes(rawStatus) ? rawStatus : (
          rawStatus === 'trialing' ? 'active' :
          rawStatus === 'incomplete' ? 'none' :
          rawStatus === 'unpaid' ? 'past_due' :
          'none'
        );

        const priceId = data.items?.data?.[0]?.price?.id || null;

        // Обновить user_subscriptions
        const upsertData: Record<string, any> = {
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: dbStatus,
          updated_at: new Date().toISOString(),
        };
        if (priceId) upsertData.stripe_price_id = priceId;
        if (data.current_period_start) {
          upsertData.current_period_start = new Date(data.current_period_start * 1000).toISOString();
        }
        if (data.current_period_end) {
          upsertData.current_period_end = new Date(data.current_period_end * 1000).toISOString();
        }

        await supabase
          .from('user_subscriptions')
          .upsert(upsertData, { onConflict: 'stripe_subscription_id' });

        // Синхронизировать tier в users (auth.users)
        const userTier = dbStatus === 'active' || rawStatus === 'trialing' ? 'pro' : 'free';
        await supabase
          .from('users')
          .update({ tier: userTier, updated_at: new Date().toISOString() })
          .eq('stripe_customer_id', customerId);

        console.log(`✓ Subscription ${subscriptionId} synced (status: ${rawStatus} → ${dbStatus}, tier: ${userTier})`);
        break;
      }

      case 'customer.subscription.deleted': {
        const customerId = data.customer as string;
        const subscriptionId = data.id as string;

        if (customerId && subscriptionId) {
          // Отмени подписку в БД
          await supabase
            .from('user_subscriptions')
            .update({
              status: 'canceled',
              canceled_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId);

          // Синхронизировать tier в users (auth.users) — только существующие колонки
          await supabase
            .from('users')
            .update({ tier: 'free', updated_at: new Date().toISOString() })
            .eq('stripe_customer_id', customerId);

          console.log(`✓ Subscription ${subscriptionId} canceled — tier set to free`);
        } else {
          console.log('⚠️ subscription.deleted: missing customer or id');
        }
        break;
      }

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
