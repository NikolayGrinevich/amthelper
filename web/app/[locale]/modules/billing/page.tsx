'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function BillingPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

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

  const loadingText = locale === 'de' ? 'Wird geladen...' :
    locale === 'ru' ? 'Загрузка...' :
    locale === 'uk' ? 'Завантаження...' : 'Loading...';

  const manageText = locale === 'de' ? 'Abrechnung verwalten' :
    locale === 'ru' ? 'Управлять оплатой' :
    locale === 'uk' ? 'Керувати оплатою' : 'Manage Billing';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('billing')}</h2>
        <p className="text-gray-600 mb-6">{t('billingDescription')}</p>
        <button
          onClick={openPortal}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? loadingText : manageText}
        </button>
        {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  );
}
