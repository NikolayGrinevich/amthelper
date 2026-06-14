const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

export default stripe;

/**
 * Создаёт Stripe Customer из пользователя AmtHelper
 */
export async function createStripeCustomer(
  email: string,
  name: string,
  customerId?: string
) {
  try {
    // Если уже есть Stripe ID, пропусти
    if (customerId) {
      return customerId;
    }

    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'amthelper',
      },
    });

    return customer.id;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

/**
 * Создаёт Checkout Session для подписки
 */
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  returnUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: returnUrl,
      billing_address_collection: 'required',
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Получает информацию о подписке
 */
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
}

/**
 * Отменяет подписку
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.del(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}
