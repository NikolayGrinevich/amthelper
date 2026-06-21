'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface BillingClientProps {
  locale: string;
  isPro: boolean;
  tier: string;
  userId: string;
  showManageOnly?: boolean;
}

export default function BillingClient({ locale, isPro, tier, userId, showManageOnly = false }: BillingClientProps) {
  const t = useTranslations('common');
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<'upgrade' | 'manage' | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setAction('upgrade');
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ locale }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      alert('Error: ' + error);
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const handleManage = async () => {
    setLoading(true);
    setAction('manage');
    try {
      const res = await fetch('/api/payments/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to open billing portal');
      }
    } catch (error) {
      alert('Error: ' + error);
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  if (showManageOnly) {
    return (
      <div className="mt-4">
        <button
          onClick={handleManage}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-700 transition disabled:opacity-50"
        >
          {loading && action === 'manage' ? (
            locale === 'de' ? 'Öffne Portal...' : locale === 'ru' ? 'Открываю портал...' : locale === 'uk' ? 'Відкриваю портал...' : 'Deschid portal...'
          ) : (
            locale === 'de' ? 'Abo im Stripe-Portal verwalten' :
            locale === 'ru' ? 'Управлять подпиской в Stripe' :
            locale === 'uk' ? 'Керувати підпискою в Stripe' :
            'Gestionează abonamentul în Stripe'
          )}
        </button>
      </div>
    );
  }

  if (isPro) {
    return (
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleManage}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-700 transition disabled:opacity-50"
        >
          {loading && action === 'manage' ? '...' : t('manageSubscription')}
        </button>
        <button
          onClick={async () => {
            try {
              const res = await fetch('/api/payments/portal', { method: 'POST' });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
              else alert(t('errorOccurred'));
            } catch {
              alert(t('errorOccurred'));
            }
          }}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          {t('cancelSubscription')}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-800 transition shadow-lg disabled:opacity-50"
      >
        {loading ? (
          locale === 'de' ? 'Weiterleitung zu Stripe...' : locale === 'ru' ? 'Перенаправление в Stripe...' : locale === 'uk' ? 'Перенаправлення в Stripe...' : 'Redirecționare la Stripe...'
        ) : (
          locale === 'de' ? 'Jetzt auf Pro upgraden — €4.99/Monat' :
          locale === 'ru' ? 'Обновиться на Pro — €4.99/мес' :
          locale === 'uk' ? 'Оновитись на Pro — €4.99/міс' :
          'Upgrade la Pro acum — €4.99/lună'
        )}
      </button>
      <p className="text-center text-sm text-gray-500 mt-3">
        {locale === 'de' ? 'Sichere Bezahlung über Stripe. Jederzeit kündbar.' :
         locale === 'ru' ? 'Безопасная оплата через Stripe. Отмена в любой момент.' :
         locale === 'uk' ? 'Безпечна оплата через Stripe. Скасування в будь-який момент.' :
         'Plată securizată prin Stripe. Anulare oricând.'}
      </p>
    </div>
  );
}