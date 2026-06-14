'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '€0',
      period: '/month',
      description: 'For personal use and trying out the service',
      features: [
        '5 document analyses per month',
        'Deadline tracking',
        'Basic letter templates',
        'Email support',
      ],
      cta: 'Get Started',
      href: '/auth/signup',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '€4.99',
      period: '/month',
      description: 'For individuals who need regular help with German bureaucracy',
      features: [
        'Unlimited document analyses',
        'AI-powered letter generation',
        'All templates + custom templates',
        'Priority email support',
        'Deadline reminders',
        'Document history',
      ],
      cta: 'Start Pro Trial',
      href: '/auth/signup?plan=pro',
      popular: true,
    },
    {
      id: 'business',
      name: 'Business',
      price: '€14.99',
      period: '/month',
      description: 'For small businesses and teams up to 3 users',
      features: [
        'Everything in Pro',
        'Up to 3 team members',
        'Evidence Vault & Audit trails',
        'Action Center with assignments',
        'Unified Inbox (email + paper)',
        'Risk Score & compliance reporting',
        'E-Rechnung 2027 monitoring',
        'Priority phone + chat support',
      ],
      cta: 'Start Business Trial',
      href: '/auth/signup?plan=business',
    },
  ];

  const handleSelect = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      if (!res.ok) throw new Error('Failed to start checkout');
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (e) {
      // Demo fallback: go to signup
      router.push(`/auth/signup?plan=${planId}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-gray-600">Choose the plan that fits your needs. No hidden fees, cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-sm border ${
                plan.popular ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
              } p-8 flex flex-col`}
            >
              {plan.popular && (
                <span className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 w-fit">
                  Most popular
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
              <p className="mt-2 text-gray-600 text-sm">{plan.description}</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelect(plan.id)}
                disabled={loading === plan.id}
                className={`mt-8 w-full rounded-lg py-3 px-4 text-center text-sm font-semibold ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } transition`}
              >
                {loading === plan.id ? 'Loading…' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-gray-500 text-sm">
          All prices include VAT where applicable. Need a custom plan for larger teams?{' '}
          <a href="mailto:sales@amthelper.de" className="text-blue-600 hover:underline">Contact sales</a>.
        </p>
      </div>
    </div>
  );
}
