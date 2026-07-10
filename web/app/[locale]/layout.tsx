import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { locales, Locale } from '@/i18n.config';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { CookieBanner } from '@/app/components/CookieBanner';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export async function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  if (!locales.includes(locale)) {
    notFound();
  }

  const mod = await import(`../../messages/${locale}/common.json`);
  const messages = mod.default ?? mod;

  return (
    <html lang={locale} translate="no">
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider locale={locale}>
            {children}
                        <Analytics />
                        <CookieBanner />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
