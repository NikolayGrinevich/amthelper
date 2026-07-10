'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function SubscriptionPage() {
  const t = useTranslations('ui');
  const locale = useLocale();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/subscriptions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'status' }) });
        const data = await res.json();
        setSubscription(data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('subscription.title')}</h1>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-12 text-center text-gray-500">{t('subscription.loading')}</div>
        ) : subscription?.active ? (
          <div className="bg-white rounded-xl shadow p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('subscription.currentPlan')}</p>
                <p className="text-2xl font-bold text-gray-900">{subscription.plan ?? 'Pro'}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">{t('subscription.active')}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('subscription.status')}</p>
              <p className="text-gray-900">{subscription.status ?? 'active'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('subscription.nextBilling')}</p>
              <p className="text-gray-900">{subscription.current_period_end ?? '—'}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-12 text-center text-gray-600">
            <p className="text-lg mb-4">{t('subscription.noActive')}</p>
            <a href={`/${locale}/pricing`} className="text-blue-600 hover:underline">{t('subscription.viewPlans')}</a>
          </div>
        )}
      </div>
    </div>
  );
}
