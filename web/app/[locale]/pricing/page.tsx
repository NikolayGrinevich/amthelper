'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

export default function PricingPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('ui');
  const [loading, setLoading] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data?.user?.tier) setUserTier(data.user.tier);
      })
      .catch(() => {})
      .finally(() => setAuthLoaded(true));
  }, []);

  const plans = [
    {
      id: 'free',
      name: t('pricing.free.name'),
      price: '€0',
      period: `/${locale === 'de' ? 'Monat' : 'month'}`,
      description: t('pricing.free.desc'),
      features: [t('pricing.free.f1'), t('pricing.free.f2'), t('pricing.free.f3'), t('pricing.free.f4')],
      cta: t('pricing.free.cta'),
    },
    {
      id: 'pro',
      name: t('pricing.pro.name'),
      price: '€4.99',
      period: `/${locale === 'de' ? 'Monat' : 'month'}`,
      description: t('pricing.pro.desc'),
      features: [t('pricing.pro.f1'), t('pricing.pro.f2'), t('pricing.pro.f3'), t('pricing.pro.f4'), t('pricing.pro.f5'), t('pricing.pro.f6')],
      cta: t('pricing.pro.cta'),
      manageCta: t('pricing.pro.manageCta'),
      popular: true,
    },
  ];

  const handleSelect = async (planId: string) => {
    if (planId === 'pro' && !authLoaded) return;
    setLoading(planId);
    try {
      if (planId === 'pro') {
        if (userTier === 'pro') {
          router.push(`/${locale}/modules/billing`);
        } else if (userTier === 'free') {
          router.push(`/${locale}/modules/billing`);
        } else {
          router.push(`/${locale}/auth/signup?plan=pro`);
        }
      } else {
        router.push(`/${locale}/auth/signup?plan=${planId}`);
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">{t('pricing.title')}</h1>
          <p className="mt-4 text-lg text-gray-600">{t('pricing.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-sm border ${
                plan.popular ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
              } p-8 flex flex-col`}
            >
              {plan.popular && (
                <span className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 w-fit">
                  {t('pricing.popular')}
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
                disabled={loading === plan.id || (plan.id === 'pro' && !authLoaded)}
                className={`mt-8 w-full rounded-lg py-3 px-4 text-center text-sm font-semibold ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } transition disabled:opacity-50`}
              >
                {loading === plan.id
                  ? t('pricing.loadingCta')
                  : plan.id === 'pro' && !authLoaded
                    ? t('pricing.loadingCta')
                    : plan.id === 'pro' && userTier === 'pro'
                      ? plan.manageCta
                      : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-gray-500 text-sm">
          {t('pricing.footer')}{' '}
          <a href="mailto:sales@amthelper.de" className="text-blue-600 hover:underline">{t('pricing.contactSales')}</a>.
        </p>
      </div>
    </div>
  );
}
