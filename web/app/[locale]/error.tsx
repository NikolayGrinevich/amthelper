'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('ui');

  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-2 text-2xl font-semibold">{t('error.title')}</h2>
      <p className="mb-6 text-gray-500">
        {error.digest ? t('error.code', { code: error.digest }) : t('error.unexpected')}
      </p>
      <button
        onClick={() => reset()}
        className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        {t('error.retry')}
      </button>
    </div>
  );
}