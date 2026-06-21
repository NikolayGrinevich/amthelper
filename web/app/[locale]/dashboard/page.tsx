'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/app/providers/AuthProvider';

export default function DashboardPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    documents: 0,
    deadlines: 0,
    completed: 0,
    letters: 0
  });

  useEffect(() => {
    fetch('/api/documents/analyzed', { credentials: 'include' })
      .then(res => res.ok ? res.json() : { documents: [] })
      .then(data => {
        const docs = data.documents || [];
        const withDeadline = docs.filter((d) => d.deadline_date);
        const completed = docs.filter((d) => d.checklist_completed);
        setStats({
          documents: docs.length,
          deadlines: withDeadline.length,
          completed: docs.length > 0 ? Math.round((completed.length / docs.length) * 100) : 0,
          letters: 0
        });
      })
      .catch(() => {});
  }, []);

  const withLocale = (p) => `/${locale}${p}`;
  const greeting = user?.full_name
    ? `${t('greetingPrefix')} ${user.full_name}!`
    : t('welcome');

  return (
    <div className="space-y-6">
      {/* Welcome Card - white, no gradient */}
      <div className="rounded-xl p-6 shadow-sm"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {greeting}
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {t('subtitle')}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push(withLocale('/modules/document-analyzer'))}
              className="px-4 py-2 rounded-lg text-sm font-medium transition"
              style={{ background: 'var(--color-primary)', color: '#fff' }}>
              {t('uploadDoc')}
            </button>
            <button onClick={() => router.push(withLocale('/modules/deadline-tracker'))}
              className="px-4 py-2 rounded-lg text-sm font-medium transition"
              style={{ background: 'var(--color-page-bg)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
              {t('viewDeadlines')}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title={t('stats.documents')} value={stats.documents.toString()} icon="📄" />
        <StatCard title={t('stats.deadlines')} value={stats.deadlines.toString()} icon="⏰" />
        <StatCard title={t('stats.completed')} value={`${stats.completed}%`} icon="✅" />
        <StatCard title={t('stats.letters')} value={stats.letters.toString()} icon="✍️" />
      </div>

      {/* Recent + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl p-6 shadow-sm"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-bold mb-4" style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-lg)' }}>
            {t('recentDocuments')}
          </h3>
          <div className="rounded-lg p-8 text-center text-sm"
            style={{ background: 'var(--color-page-bg)', color: 'var(--color-text-muted)' }}>
            {t('noDocuments')}
          </div>
        </div>

        <div className="rounded-xl p-6 shadow-sm"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-bold mb-4" style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-lg)' }}>
            {t('quickLinks')}
          </h3>
          <div className="space-y-2">
            <QuickLink href={withLocale('/modules/document-analyzer')} label={t('uploadDoc')} icon="📄" />
            <QuickLink href={withLocale('/modules/deadline-tracker')} label={t('viewDeadlines')} icon="⏰" />
            <QuickLink href={withLocale('/modules/templates')} label={t('templates')} icon="📋" />
            <QuickLink href={withLocale('/modules/letter-generator')} label={t('stats.letters')} icon="✍️" />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="rounded-xl p-6 shadow-sm"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <h3 className="font-bold mb-6" style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-lg)' }}>
          {t('features')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard icon="🔍" title={t('documentAnalyzer')} description={t('analyzeDescription')} />
          <FeatureCard icon="⏱️" title={t('deadlineTracker')} description={t('trackDescription')} />
          <FeatureCard icon="📝" title={t('letterGenerator')} description={t('generateDescription')} />
          <FeatureCard icon="📋" title={t('documentChecklist')} description={t('checklistDescription')} />
          <FeatureCard icon="📄" title={t('templates')} description={t('templatesDescription')} />
          <FeatureCard icon="🌍" title={t('multilingual')} description={t('multilingualDescription')} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-xl p-5 shadow-sm transition hover:shadow-md"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{title}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

function QuickLink({ href, label, icon }) {
  return (
    <a href={href}
      className="flex items-center gap-3 p-3 rounded-lg transition text-sm"
      style={{ color: 'var(--color-text-secondary)' }}>
      <span className="text-xl">{icon}</span>
      <span className="font-medium flex-1">{label}</span>
      <span className="text-lg" style={{ color: 'var(--color-text-muted)' }}>→</span>
    </a>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-lg p-4 transition hover:shadow-md"
      style={{ border: '1px solid var(--color-border)' }}>
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="font-bold mb-1 text-sm" style={{ color: 'var(--color-text-primary)' }}>{title}</h4>
      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
    </div>
  );
}
