'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

export default function PricingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('ui');
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: t('pricing.free.name'),
      price: '€0',
      period: `/${locale === 'de' ? 'Monat' : 'month'}`,
      description: t('pricing.free.desc'),
      features: [t('pricing.free.f1'), t('pricing.free.f2'), t('pricing.free.f3'), t('pricing.free.f4')],
      cta: t('pricing.free.cta'),
      href: '/auth/signup',
    },
    {
      id: 'pro',
      name: t('pricing.pro.name'),
      price: '€4.99',
      period: `/${locale === 'de' ? 'Monat' : 'month'}`,
      description: t('pricing.pro.desc'),
      features: [t('pricing.pro.f1'), t('pricing.pro.f2'), t('pricing.pro.f3'), t('pricing.pro.f4'), t('pricing.pro.f5'), t('pricing.pro.f6')],
      cta: t('pricing.pro.cta'),
      href: '/auth/signup?plan=pro',
      popular: true,
    },
    {
      id: 'business',
      name: locale === 'de' ? 'Business' : 'Business',
      price: '€14.99',
      period: `/${locale === 'de' ? 'Monat' : 'month'}`,
      description: locale === 'de' ? 'Für kleine Unternehmen und Teams bis zu 3 Nutzer' :
        locale === 'ru' ? 'Для малого бизнеса и команд до 3 пользователей' :
        locale === 'uk' ? 'Для малого бізнесу та команд до 3 користувачів' :
        locale === 'ro' ? 'Pentru mici afaceri și echipe până la 3 utilizatori' :
        'Küçük işletmeler ve 3 kullanıcıya kadar ekipler için',
      features: locale === 'de' ? [
        'Alles aus Pro', 'Bis zu 3 Teammitglieder', 'Evidence Vault & Audit-Trails',
        'Action Center mit Zuweisungen', 'Unified Inbox (E-Mail + Post)',
        'Risk Score & Compliance-Reporting', 'E-Rechnung 2027 Monitoring', 'Priorisierter Telefon- & Chat-Support',
      ] : locale === 'ru' ? [
        'Всё из Pro', 'До 3 участников команды', 'Evidence Vault & аудит',
        'Action Center с назначениями', 'Unified Inbox (email + почта)',
        'Risk Score & compliance-отчёты', 'E-Rechnung 2027 мониторинг', 'Приоритетная телефонная и чат-поддержка',
      ] : locale === 'uk' ? [
        'Все з Pro', 'До 3 учасників команди', 'Evidence Vault & аудит',
        'Action Center з призначеннями', 'Unified Inbox (email + пошта)',
        'Risk Score & compliance-звіти', 'E-Rechnung 2027 моніторинг', 'Пріоритетна телефонна та чат-підтримка',
      ] : locale === 'ro' ? [
        'Tot din Pro', 'Până la 3 membri ai echipei', 'Evidence Vault & audit',
        'Action Center cu atribuiri', 'Unified Inbox (email + poștă)',
        'Risk Score & rapoarte de conformitate', 'E-Rechnung 2027 monitorizare', 'Suport prioritar prin telefon și chat',
      ] : [
        'Pro\'daki her şey', '3 ekip üyesine kadar', 'Evidence Vault & denetim',
        'Atamalı Action Center', 'Unified Inbox (e-posta + posta)',
        'Risk Score & uyum raporları', 'E-Rechnung 2027 izleme', 'Öncelikli telefon ve sohbet desteği',
      ],
      cta: locale === 'de' ? 'Business-Test starten' :
        locale === 'ru' ? 'Начать Business-период' :
        locale === 'uk' ? 'Почати Business-період' :
        locale === 'ro' ? 'Începe proba Business' :
        'Business denemesini başlat',
      href: '/auth/signup?plan=business',
    },
  ];

  const handleSelect = async (planId: string) => {
    setLoading(planId);
    try {
      if (planId === 'pro') {
        // Redirect authorized users to billing page (has checkout button),
        // unauthorized users to signup with plan hint
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await res.json();
        if (data?.user) {
          router.push(`/${locale}/modules/billing`);
        } else {
          router.push(`/${locale}/auth/signup?plan=pro`);
        }
      } else {
        router.push(`/${locale}/auth/signup?plan=${planId}`);
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">{t('pricing.title')}</h1>
          <p className="mt-4 text-lg text-gray-600">{t('pricing.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-sm border ${
                plan.popular ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
              } p-8 flex flex-col`}
            >
              {plan.popular && (
                <span className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 w-fit">
                  {t('pricing.popular')}
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
              <p className="mt-2 text-gray-600 text-sm">{plan.description}</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelect(plan.id)}
                disabled={loading === plan.id}
                className={`mt-8 w-full rounded-lg py-3 px-4 text-center text-sm font-semibold ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } transition`}
              >
                {loading === plan.id ? t('pricing.loadingCta') : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-gray-500 text-sm">
          {t('pricing.footer')}{' '}
          <a href="mailto:sales@amthelper.de" className="text-blue-600 hover:underline">{t('pricing.contactSales')}</a>.
        </p>
      </div>
    </div>
  );
}
