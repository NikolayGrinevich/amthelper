import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { locales, Locale } from '@/i18n.config';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { SidebarClient } from '@/app/components/dashboard/SidebarClient';
import { HeaderClient } from '@/app/components/dashboard/HeaderClient';
import { CookieBanner } from '@/app/components/CookieBanner';
import '../globals.css';

export const metadata: Metadata = {
  title: 'AmtHelper - Module',
  description: 'AmtHelper module',
};

export async function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

interface ModulesLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}

export default async function ModulesLayout({
  children,
  params: { locale },
}: ModulesLayoutProps) {
  if (!locales.includes(locale)) {
    notFound();
  }

  const mod = await import(`../../../messages/${locale}/common.json`);
  const messages = mod.default ?? mod;

  const common = messages.common;
  const auth = messages.auth;
  const nav = messages.nav;

  return (
    <AuthProvider locale={locale}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <aside style={{ width: '240px', flexShrink: 0 }}>
          <SidebarClient locale={locale} nav={nav} />
        </aside>
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <HeaderClient
            locale={locale}
            common={common}
            auth={auth}
          />
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
      <CookieBanner />
    </AuthProvider>
  );
}