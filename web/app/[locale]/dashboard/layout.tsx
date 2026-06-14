import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { locales, Locale } from '@/i18n.config';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { CookieBanner } from '@/app/components/CookieBanner';
import { ModuleLayout } from '@/app/components/dashboard/ModuleLayout';
import '../globals.css';

export const metadata: Metadata = {
  title: 'AmtHelper - Dashboard',
  description: 'Ihr persönlicher Assistent für deutsche Behördengänge',
};

export async function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}

export default async function DashboardLayout({
  children,
  params: { locale },
}: DashboardLayoutProps) {
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
      <ModuleLayout
        locale={locale}
        nav={nav}
        common={common}
        auth={auth}
      >
        {children}
      </ModuleLayout>
      <CookieBanner />
    </AuthProvider>
  );
}
