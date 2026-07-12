'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export function Footer() {
  const locale = useLocale();
  const t = useTranslations('ui');

  return (
    <footer className="bg-gray-100 border-t mt-12 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <h4 className="font-bold mb-3">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/datenschutz`} className="hover:underline">
                  {t('footer.datenschutz')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/impressum`} className="hover:underline">
                  {t('footer.impressum')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">{t('footer.product')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/pricing`} className="hover:underline">
                  {t('footer.prices')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">{t('footer.support')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@amthelper.de" className="hover:underline">
                  support@amthelper.de
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 text-center text-sm text-gray-600">
          <p>{t('footer.copyright')}</p>
          <p className="mt-2 text-xs">{t('footer.tagline')}</p>
        </div>
      </div>
    </footer>
  );
}
