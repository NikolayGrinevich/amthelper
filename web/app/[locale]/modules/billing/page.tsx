'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function BillingPage() {
  const t = useTranslations('common');
  const tUI = useTranslations('ui');
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<string | null>(null);
  const [proExpiresAt, setProExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data?.tier) setUserTier(data.tier);
        if (data?.pro_expires_at) setProExpiresAt(data.pro_expires_at);
      })
      .catch(() => {});
  }, []);

  const openPortal = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/payments/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) {
        setStatus(t('noSubscription') || 'No subscription found');
        return;
      }
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (e) {
      setStatus('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('billing')}</h2>
          <p className="text-gray-600 mb-6">{t('billingDescription')}</p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {tUI('free')}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mb-3">0€</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ {tUI('freeAnalysesMonth')}</li>
                <li>✓ {tUI('freeLettersMonth')}</li>
              </ul>
            </div>

            <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold text-lg text-blue-900 mb-1">
                {tUI('pro')}
              </h3>
              <p className="text-2xl font-bold text-blue-900 mb-3">9,99€</p>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ {tUI('proAnalysesMonth')}</li>
                <li>✓ {tUI('proLettersMonth')}</li>
              </ul>
            </div>
          </div>

          {userTier === 'pro' && proExpiresAt && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800 text-sm">
                {tUI('trialExpires', { date: new Date(proExpiresAt).toLocaleDateString(locale) })}
              </p>
            </div>
          )}

          <button
            onClick={openPortal}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? tUI('loadingText') : tUI('manageBilling')}
          </button>
          {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
        </div>
      </div>
  );
}
