'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('common');
  const locale = useLocale();

  const withLocale = (p: string) => `/${locale}${p}`;

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-2">{t('welcome')}</h2>
        <p className="text-blue-100 mb-4">{t('subtitle')}</p>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
            {t('uploadDoc')}
          </button>
          <button className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition">
            {t('viewDeadlines')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('stats.documents')} value="0" icon="📄" />
        <StatCard title={t('stats.deadlines')} value="0" icon="⏰" />
        <StatCard title={t('stats.completed')} value="0%" icon="✅" />
        <StatCard title={t('stats.letters')} value="0" icon="✍️" />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Documents */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-4">{t('recentDocuments')}</h3>
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            {t('noDocuments')}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-4">{t('quickLinks')}</h3>
          <div className="space-y-3">
            <QuickLink href={withLocale('/modules/document-analyzer')} label={t('uploadDoc')} icon="📄" />
            <QuickLink href={withLocale('/modules/deadline-tracker')} label={t('viewDeadlines')} icon="⏰" />
            <QuickLink href={withLocale('/modules/templates')} label="Template" icon="📋" />
            <QuickLink href={withLocale('/modules/letter-generator')} label={t('stats.letters')} icon="✍️" />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold mb-6">{t('features')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon="🔍"
            title={t('documentAnalyzer')}
            description={t('analyzeDescription')}
          />
          <FeatureCard
            icon="⏱️"
            title={t('deadlineTracker')}
            description={t('trackDescription')}
          />
          <FeatureCard
            icon="📝"
            title={t('letterGenerator')}
            description={t('generateDescription')}
          />
          <FeatureCard
            icon="📋"
            title={t('documentChecklist')}
            description={t('checklistDescription')}
          />
          <FeatureCard
            icon="📄"
            title={t('templates')}
            description={t('templatesDescription')}
          />
          <FeatureCard
            icon="🌍"
            title={t('multilingual')}
            description={t('multilingualDescription')}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

function QuickLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-gray-700 hover:text-blue-600"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium">{label}</span>
      <span className="text-xl ml-auto">→</span>
    </a>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
