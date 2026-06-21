import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { locales, Locale } from '@/i18n.config';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { CookieBanner } from '@/app/components/CookieBanner';
import './globals.css';

export const metadata: Metadata = {
  title: 'AmtHelper - Документы для ведомств',
  description: 'AI помощник для немецких документов и писем',
};

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
            <CookieBanner />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
