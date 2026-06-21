'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/app/providers/AuthProvider';

interface AnalyzedDocument {
  id: string;
  document_id: string;
  file_name: string;
  organization_type: string;
  deadline_date: string | null;
  processed_at: string;
  analysis_result: {
    urgency: 'low' | 'medium' | 'high' | 'critical';
    summary: string;
  };
}

type UrgencyLevel = 'critical' | 'high' | 'ok' | 'none';

function getDaysLeft(deadlineDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(deadlineDate);
  deadline.setHours(0, 0, 0, 0);
  return Math.round((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgencyLevel(deadlineDate: string | null): UrgencyLevel {
  if (!deadlineDate) return 'none';
  const days = getDaysLeft(deadlineDate);
  if (days < 0) return 'critical';
  if (days < 7) return 'critical';
  if (days < 30) return 'high';
  return 'ok';
}

const urgencyConfig: Record<UrgencyLevel, { border: string; bg: string; badge: string; dot: string }> = {
  critical: {
    border: 'border-red-300',
    bg: 'bg-red-50',
    badge: 'bg-red-100 text-red-800 border-red-200',
    dot: 'bg-red-500',
  },
  high: {
    border: 'border-yellow-300',
    bg: 'bg-yellow-50',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dot: 'bg-yellow-500',
  },
  ok: {
    border: 'border-green-300',
    bg: 'bg-green-50',
    badge: 'bg-green-100 text-green-800 border-green-200',
    dot: 'bg-green-500',
  },
  none: {
    border: 'border-gray-200',
    bg: 'bg-gray-50',
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
    dot: 'bg-gray-400',
  },
};

export default function DeadlineTrackerPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('modules.deadlineTracker');
  const { user, loading: authLoading } = useAuth();

  const [documents, setDocuments] = useState<AnalyzedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDocuments();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/documents/analyzed', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const docs: AnalyzedDocument[] = data.documents || [];

      // Sort: overdue first, then by days ascending, then no-deadline last
      const sorted = [...docs].sort((a, b) => {
        if (!a.deadline_date && !b.deadline_date) return 0;
        if (!a.deadline_date) return 1;
        if (!b.deadline_date) return -1;
        return new Date(a.deadline_date).getTime() - new Date(b.deadline_date).getTime();
      });

      setDocuments(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLetter = (doc: AnalyzedDocument) => {
    const id = doc.document_id || doc.id;
    router.push(`/${locale}/modules/letter-generator?id=${id}&from=deadline`);
  };

  const formatDaysLabel = (days: number): string => {
    if (days === 1) return `1 ${t('days_left_one')}`;
    return `${days} ${t('days_left')}`;
  };

  const docsWithDeadline = documents.filter(d => d.deadline_date);
  const docsWithoutDeadline = documents.filter(d => !d.deadline_date);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="page-title">{t('title')}</h1>
        <p className="page-subtitle">{t('subtitle')}</p>
      </div>

      {/* Summary bar */}
      {docsWithDeadline.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {(['critical', 'high', 'ok'] as UrgencyLevel[]).map(level => {
            const count = docsWithDeadline.filter(d => getUrgencyLevel(d.deadline_date) === level).length;
            const cfg = urgencyConfig[level];
            const label = level === 'critical' ? t('urgency_critical') : level === 'high' ? t('urgency_high') : t('urgency_ok');
            return (
              <div key={level} className={`card p-4 text-center ${cfg.bg}`}>
                <div className="text-3xl font-bold text-gray-900">{count}</div>
                <div className={`mt-1 text-xs font-semibold px-2 py-0.5 rounded-full border inline-block ${cfg.badge}`}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No data states */}
      {documents.length === 0 && !error && (
        <div className="text-center py-16 card">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">{t('no_documents')}</p>
        </div>
      )}

      {error && (
        <div className="p-4 card p-4 text-red-700 text-sm bg-red-50">{error}</div>
      )}

      {/* Documents with deadlines */}
      {docsWithDeadline.length > 0 && (
        <div className="space-y-3">
          {docsWithDeadline.map(doc => {
            const days = getDaysLeft(doc.deadline_date!);
            const level = getUrgencyLevel(doc.deadline_date);
            const cfg = urgencyConfig[level];
            const isOverdue = days < 0;

            return (
              <div
                key={doc.id}
                className={`card p-4 flex items-center justify-between gap-4 ${cfg.bg}`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  {/* Urgency dot */}
                  <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1.5 ${cfg.dot}`} />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{doc.file_name}</p>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">{doc.organization_type}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(doc.deadline_date!).toLocaleDateString(locale, {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Days badge */}
                  <span className={`px-3 py-1.5 rounded-xl text-sm font-bold border ${cfg.badge} whitespace-nowrap`}>
                    {isOverdue
                      ? `${Math.abs(days)} ${t('days_overdue')}`
                      : days === 0
                      ? t('overdue')
                      : formatDaysLabel(days)}
                  </span>

                  {/* Create letter button */}
                  <button
                    id={`create-letter-${doc.id}`}
                    onClick={() => handleCreateLetter(doc)}
                    className="flex items-center gap-2 px-4 py-2 btn-primary"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 01-2-2V7a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V5a1 1 0 00-1-1h3a1 1 0 001-1V4z" />
                    </svg>
                    {t('create_letter')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Documents without deadline */}
      {docsWithoutDeadline.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('no_deadline')}</h2>
          <div className="space-y-2">
            {docsWithoutDeadline.map(doc => (
              <div
                key={doc.id}
                className="rounded-xl border border-gray-200 bg-white p-4 flex items-center justify-between gap-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-700 truncate">{doc.file_name}</p>
                    <p className="text-sm text-gray-400 truncate">{doc.organization_type}</p>
                  </div>
                </div>
                <button
                  id={`create-letter-no-deadline-${doc.id}`}
                  onClick={() => handleCreateLetter(doc)}
                  className="flex-shrink-0 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {t('create_letter')} →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}