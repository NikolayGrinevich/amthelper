'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

const VALID_LOCALES = ['de', 'ru', 'uk', 'ro', 'tr'];

export default function SubscriptionPage() {
  const localeRaw = useLocale();
  const router = useRouter();
  const locale = VALID_LOCALES.includes(localeRaw) ? localeRaw : 'de';

  useEffect(() => {
    router.replace(`/${locale}/modules/billing`);
  }, [locale, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}
