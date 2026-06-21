import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ error: 'Key missing', keyExists: false });
  
  try {
    const stripe = new Stripe(key, { apiVersion: '2023-10-16' as any });
    const balance = await stripe.balance.retrieve();
    return NextResponse.json({ success: true, keyLength: key.length, keyStart: key.substring(0,12) });
  } catch (e: any) {
    return NextResponse.json({ 
      error: e.message, 
      type: e.type,
      rawType: e.rawType,
      keyLength: key.length,
      keyStart: key.substring(0,12)
    });
  }
}
