'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/app/providers/AuthProvider';

interface AnalyzedDocument {
  id: string;
  file_name: string;
  organization_type: string;
  analysis_result: {
    required_documents: string[];
    summary?: string;
  };
}

type CheckedMap = Record<string, boolean>;

function ProgressBar({ value, max, color = 'blue' }: { value: number; max: number; color?: string }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  const barColor = pct === 100 ? 'bg-green-500' : color === 'blue' ? 'bg-blue-500' : 'bg-blue-400';
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`${barColor} h-2 rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function ChecklistPage() {
  const t = useTranslations('modules.checklist');
  const { user, loading: authLoading } = useAuth();

  const [documents, setDocuments] = useState<AnalyzedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // checked[docId][itemIndex] = true/false
  const [checked, setChecked] = useState<Record<string, CheckedMap>>({});

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
      const docs: AnalyzedDocument[] = (data.documents || []).filter(
        (d: AnalyzedDocument) => (d.analysis_result?.required_documents?.length ?? 0) > 0
      );
      setDocuments(docs);
      // Init checked state
      const initial: Record<string, CheckedMap> = {};
      docs.forEach(doc => {
        initial[doc.id] = {};
        doc.analysis_result.required_documents.forEach((_, i) => {
          initial[doc.id][i] = false;
        });
      });
      setChecked(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = useCallback((docId: string, idx: number) => {
    setChecked(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [idx]: !prev[docId]?.[idx],
      },
    }));
  }, []);

  const resetGroup = useCallback((docId: string, itemCount: number) => {
    const reset: CheckedMap = {};
    for (let i = 0; i < itemCount; i++) reset[i] = false;
    setChecked(prev => ({ ...prev, [docId]: reset }));
  }, []);

  // Overall stats
  const totalItems = documents.reduce(
    (sum, doc) => sum + (doc.analysis_result.required_documents?.length ?? 0), 0
  );
  const totalDone = documents.reduce((sum, doc) => {
    const checkedForDoc = checked[doc.id] || {};
    return sum + Object.values(checkedForDoc).filter(Boolean).length;
  }, 0);
  const overallPct = totalItems === 0 ? 0 : Math.round((totalDone / totalItems) * 100);

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

      {/* Overall progress */}
      {documents.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-800">{t('overall_progress')}</span>
            {totalDone === totalItems && totalItems > 0 ? (
              <span className="text-green-600 font-bold text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('all_done')}
              </span>
            ) : (
              <span className="text-sm text-gray-500">
                {totalDone} {t('items_done')} {totalItems}
                <span className="ml-2 text-blue-600 font-bold">{overallPct}%</span>
              </span>
            )}
          </div>
          <ProgressBar value={totalDone} max={totalItems} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 card p-4 text-red-700 text-sm bg-red-50">{error}</div>
      )}

      {/* No documents */}
      {documents.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">{t('no_documents')}</p>
        </div>
      )}

      {/* Checklist groups */}
      <div className="space-y-6">
        {documents.map(doc => {
          const items = doc.analysis_result.required_documents;
          const docChecked = checked[doc.id] || {};
          const doneCount = Object.values(docChecked).filter(Boolean).length;
          const allDone = doneCount === items.length;

          return (
            <div
              key={doc.id}
              className={`card overflow-hidden transition-all ${allDone ? 'border-green-200' : 'border-gray-200'}`}
            >
              {/* Group header */}
              <div className={`px-5 py-3 flex items-start justify-between gap-4 ${allDone ? 'bg-green-50' : 'bg-gray-50'}`}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {allDone && (
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <h3 className="font-semibold text-gray-900 truncate">{doc.file_name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{doc.organization_type}</p>
                  {/* Mini progress */}
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 max-w-[140px]">
                      <ProgressBar value={doneCount} max={items.length} />
                    </div>
                    <span className={`text-xs font-medium ${allDone ? 'text-green-600' : 'text-gray-500'}`}>
                      {doneCount}/{items.length} {t('completed')}
                    </span>
                  </div>
                </div>

                {/* Reset button */}
                {doneCount > 0 && (
                  <button
                    id={`reset-${doc.id}`}
                    onClick={() => resetGroup(doc.id, items.length)}
                    className="flex-shrink-0 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t('reset')}
                  </button>
                )}
              </div>

              {/* Checklist items */}
              <ul className="divide-y divide-gray-100">
                {items.map((item, idx) => {
                  const isChecked = !!docChecked[idx];
                  return (
                    <li key={idx}>
                      <label
                        htmlFor={`check-${doc.id}-${idx}`}
                        className={`flex items-start gap-4 px-5 py-3 cursor-pointer transition-colors ${isChecked ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}
                      >
                        {/* Custom checkbox */}
                        <div className="flex-shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            id={`check-${doc.id}-${idx}`}
                            checked={isChecked}
                            onChange={() => toggleItem(doc.id, idx)}
                            className="hidden"
                          />
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                              isChecked
                                ? 'bg-green-500 border-green-500'
                                : 'bg-white border-gray-300 hover:border-blue-400'
                            }`}
                            onClick={() => toggleItem(doc.id, idx)}
                          >
                            {isChecked && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <span className={`text-sm leading-relaxed transition-all ${isChecked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {item}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>

              {/* All done banner */}
              {allDone && (
                <div className="px-6 py-3 bg-green-50 border-t border-green-200 text-center text-sm text-green-700 font-medium">
                  ✅ {t('all_done')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}