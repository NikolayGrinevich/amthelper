'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/app/providers/AuthProvider';
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher';
import { Footer } from '@/app/components/Footer';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const params = useParams();
  const locale = params.locale as string || 'de';
  const t = useTranslations('landing');
  const currentLocale = useLocale();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(`/${locale}/dashboard`);
    }
  }, [isAuthenticated, loading, router, locale]);

  const goToSignup = () => router.push(`/${locale}/auth/signup`);
  const goToSignin = () => router.push(`/${locale}/auth/signin`);
  const scrollToHow = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="font-bold text-lg text-gray-900">AmtHelper</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="light" />
            <button onClick={goToSignin} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
              {t('nav.login')}
            </button>
            <button onClick={goToSignup} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
              {t('hero.cta')}
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            {t('badge')}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={goToSignup} className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">
              {t('hero.cta')}
            </button>
            <button onClick={scrollToHow} className="px-8 py-4 bg-gray-100 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-200 transition">
              {t('hero.ctaSecondary')}
            </button>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('problem.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '📝', text: t('problem.item1') },
              { icon: '⏰', text: t('problem.item2') },
              { icon: '😟', text: t('problem.item3') },
              { icon: '💸', text: t('problem.item4') },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-5 bg-white rounded-xl border border-gray-100">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <p className="text-gray-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('solution.title')}</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">{t('solution.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🔍', title: t('solution.item1Title'), desc: t('solution.item1Desc') },
              { icon: '✅', title: t('solution.item2Title'), desc: t('solution.item2Desc') },
              { icon: '✍️', title: t('solution.item3Title'), desc: t('solution.item3Desc') },
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-blue-50 border border-blue-100">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('howItWorks.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '1', title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Desc') },
              { num: '2', title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Desc') },
              { num: '3', title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Desc') },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="w-12 h-12 bg-blue-600 text-white text-xl font-bold rounded-full flex items-center justify-center mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('features.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔍', title: t('features.f1Title'), desc: t('features.f1Desc') },
              { icon: '⏰', title: t('features.f2Title'), desc: t('features.f2Desc') },
              { icon: '✍️', title: t('features.f3Title'), desc: t('features.f3Desc') },
              { icon: '✅', title: t('features.f4Title'), desc: t('features.f4Desc') },
              { icon: '📋', title: t('features.f5Title'), desc: t('features.f5Desc') },
              { icon: '🌍', title: t('features.f6Title'), desc: t('features.f6Desc') },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">{t('pricing.title')}</h2>
          <p className="text-gray-600 text-center mb-12">{t('pricing.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t('pricing.freeName')}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">{t('pricing.freePrice')}</span>
                <span className="text-gray-500">{t('pricing.freePeriod')}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[t('pricing.freeF1'), t('pricing.freeF2'), t('pricing.freeF3'), t('pricing.freeF4')].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-500 flex-shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={goToSignup} className="w-full py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition">
                {t('pricing.freeCta')}
              </button>
            </div>
            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-blue-500 p-8 flex flex-col relative shadow-lg shadow-blue-50">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                {t('pricing.proBadge')}
              </span>
              <h3 className="text-xl font-bold text-blue-900 mb-1">{t('pricing.proName')}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-blue-900">{t('pricing.proPrice')}</span>
                <span className="text-gray-500">{t('pricing.proPeriod')}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[t('pricing.proF1'), t('pricing.proF2'), t('pricing.proF3'), t('pricing.proF4'), t('pricing.proF5')].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-500 flex-shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={goToSignup} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                {t('pricing.proCta')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECURITY ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('security.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🔒', title: t('security.item1Title'), desc: t('security.item1Desc') },
              { icon: '🇩🇪', title: t('security.item2Title'), desc: t('security.item2Desc') },
              { icon: '🚫', title: t('security.item3Title'), desc: t('security.item3Desc') },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('faq.title')}</h2>
          <div className="space-y-4">
            {[
              { q: t('faq.q1'), a: t('faq.a1') },
              { q: t('faq.q2'), a: t('faq.a2') },
              { q: t('faq.q3'), a: t('faq.a3') },
              { q: t('faq.q4'), a: t('faq.a4') },
              { q: t('faq.q5'), a: t('faq.a5') },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-100 group">
                <summary className="flex items-center justify-between cursor-pointer p-5 list-none">
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 text-gray-600 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4 sm:px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('finalCta.title')}</h2>
          <p className="text-blue-100 text-lg mb-8">{t('finalCta.subtitle')}</p>
          <button onClick={goToSignup} className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-50 transition shadow-lg">
            {t('finalCta.cta')}
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}