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

          {/* Plan comparison */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Free plan */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {locale === 'de' ? 'Kostenlos' : locale === 'ru' ? 'Бесплатно' : locale === 'uk' ? 'Безкоштовно' : 'Free'}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mb-3">
                0€
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ {locale === 'de' ? '3 Analysen / Monat' : locale === 'ru' ? '3 анализа / месяц' : locale === 'uk' ? '3 аналізи / місяць' : '3 analyses / month'}</li>
                <li>✓ {locale === 'de' ? '3 Briefe / Monat' : locale === 'ru' ? '3 письма / месяц' : locale === 'uk' ? '3 листи / місяць' : '3 letters / month'}</li>
              </ul>
            </div>

            {/* Pro plan */}
            <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold text-lg text-blue-900 mb-1">
                {locale === 'de' ? 'Pro' : locale === 'ru' ? 'Pro' : locale === 'uk' ? 'Pro' : 'Pro'}
              </h3>
              <p className="text-2xl font-bold text-blue-900 mb-3">
                9,99€
              </p>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ {locale === 'de' ? '20 Analysen / Monat' : locale === 'ru' ? '20 анализов / месяц' : locale === 'uk' ? '20 аналізів / місяць' : '20 analyses / month'}</li>
                <li>✓ {locale === 'de' ? '20 Briefe / Monat' : locale === 'ru' ? '20 писем / месяц' : locale === 'uk' ? '20 листів / місяць' : '20 letters / month'}</li>
              </ul>
            </div>
          </div>

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
