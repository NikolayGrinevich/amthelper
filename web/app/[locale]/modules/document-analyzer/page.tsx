'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/app/providers/AuthProvider';

interface AnalysisResult {
  sender: string;
  recipient: string;
  document_type: string;
  key_points: string[];
  deadline: string | null;
  required_documents: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
}

interface AnalyzedDocument {
  id: string;
  user_id: string;
  document_id: string;
  file_name: string;
  analysis_result: AnalysisResult;
  organization_type: string;
  deadline_date: string | null;
  processed_at: string;
}

type UploadState = 'idle' | 'selecting' | 'loading' | 'result' | 'error';

interface UploadStateData {
  state: UploadState;
  files?: { file: File; url: string }[];  // Selected photos with preview URLs
  result?: AnalysisResult;
  error?: string;
  fileName?: string;
  documentId?: string | null;
}

const EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
const MAX_PHOTOS = 10;

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getUrgencyLabel = (urgency: string) => {
  const labels: Record<string, string> = {
    critical: 'Критический',
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
  };
  return labels[urgency] || urgency;
};

export default function DocumentAnalyzerPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('modules.documentAnalyzer');
  const { user, loading: authLoading } = useAuth();
  const [uploadState, setUploadState] = useState<UploadStateData>({ state: 'idle' });
  const [dragActive, setDragActive] = useState(false);
  const [recentDocuments, setRecentDocuments] = useState<AnalyzedDocument[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isClient = useRef(false);

  useEffect(() => { isClient.current = true; }, []);

  useEffect(() => {
    if (!authLoading && isClient.current && user) loadRecentDocuments();
  }, [user, authLoading]);

  const loadRecentDocuments = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/documents/analyzed', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.documents) setRecentDocuments(data.documents);
      }
    } catch (err) { console.error('Failed to load recent documents:', err); }
  };

  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!EXTENSIONS.includes(ext)) return 'Неподдерживаемый формат. Используйте: PDF, PNG, JPG, GIF, WebP';
    if (file.size > MAX_FILE_SIZE) return 'Файл слишком большой. Максимум 10 MB';
    return null;
  };

  // Add files to the selection
  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: { file: File; url: string }[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setUploadState({ state: 'error', error, fileName: file.name });
        return;
      }
      // Create preview URL for images
      const url = URL.createObjectURL(file);
      validFiles.push({ file, url });
    }

    setUploadState(prev => {
      const existingFiles = prev.state === 'selecting' && prev.files ? prev.files : [];
      const allFiles = [...existingFiles, ...validFiles];

      if (allFiles.length > MAX_PHOTOS) {
        return { state: 'error', error: `Максимум ${MAX_PHOTOS} фото` };
      }

      return { state: 'selecting', files: allFiles };
    });
  }, [validateFile]);

  // Remove a specific photo
  const removeFile = useCallback((index: number) => {
    setUploadState(prev => {
      if (prev.state !== 'selecting' || !prev.files) return { state: 'idle' };
      const files = prev.files.filter((_, i) => i !== index);
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prev.files[index].url);
      if (files.length === 0) return { state: 'idle' };
      return { ...prev, files };
    });
  }, []);

  // Analyze all selected files
  const handleAnalyze = useCallback(async () => {
    if (uploadState.state !== 'selecting' || !uploadState.files?.length) return;

    const files = uploadState.files;
    setUploadState({
      state: 'loading',
      fileName: files.length > 1 ? `${files.length} фото` : files[0].file.name,
    });

    try {
      const formData = new FormData();
      // Send all files as 'files[]' for the API
      for (const { file } of files) {
        formData.append('files[]', file);
      }
      formData.append('language', locale);

      const res = await fetch('/api/documents/analyze', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');

      const analysisResult: AnalysisResult = data.analyzed_data;
      const orgType = data.analyzed_data?.sender || 'Unknown';
      const deadlineDate = data.analyzed_data?.deadline || null;

      // Save to database
      const firstFileName = files[0].file.name;
      const saveRes = await fetch('/api/documents/save-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          file_name: files.length > 1 ? `${files.length} фото — ${firstFileName}` : firstFileName,
          file_type: 'image/jpeg',
          file_size: 0,
          analysis_result: analysisResult,
          organization_type: orgType,
          deadline_date: deadlineDate,
        }),
      });

      if (saveRes.ok) {
        const saveData = await saveRes.json();
        if (saveData.document) {
          setRecentDocuments(prev => [saveData.document, ...prev]);
        }
      }

      setUploadState({ state: 'result', result: analysisResult, fileName: uploadState.fileName });

      // Cleanup preview URLs
      files.forEach(({ url }) => URL.revokeObjectURL(url));

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка анализа';
      setUploadState({ state: 'error', error: message, fileName: uploadState.fileName });
    }
  }, [uploadState, locale]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length > 0) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  }, [addFiles]);

  const handleRetry = useCallback(() => { setUploadState({ state: 'idle' }); }, []);
  const handleNewAnalysis = useCallback(() => { setUploadState({ state: 'idle' }); }, []);

  const handleGenerateLetter = useCallback(() => {
    const docId = uploadState.documentId || recentDocuments?.[0]?.id;
    if (docId) {
      router.push(`/${locale}/modules/letter-generator?id=${docId}&from=document`);
    } else {
      router.push(`/${locale}/modules/letter-generator`);
    }
  }, [router, locale, uploadState, recentDocuments]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-1">{t('subtitle')}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* IDLE: Upload area */}
        {uploadState.state === 'idle' && (
          <div
            className={`relative p-12 text-center transition-all duration-200 ${
              dragActive
                ? 'bg-blue-50 border-2 border-blue-400'
                : 'border-2 border-dashed border-gray-300 hover:border-blue-400'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              accept=".pdf,.png,.jpg,.jpeg,.gif,.webp"
              capture="environment"
              multiple
              onChange={handleInputChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Upload document"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900">{t('uploaderCTA')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('uploaderHint')}</p>
              <p className="text-xs text-gray-400 mt-2">Можно выбрать несколько фото одного документа</p>
            </label>
          </div>
        )}

        {/* SELECTING: Show photo previews with add/remove */}
        {uploadState.state === 'selecting' && uploadState.files && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Выбрано фото: {uploadState.files.length}
            </h3>

            {/* Photo grid preview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {uploadState.files.map((item, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <div className="aspect-[3/4] relative">
                    {/* Show image preview or PDF icon */}
                    {item.file.type === 'application/pdf' ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Remove button (on hover) */}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                    aria-label="Remove photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* File name */}
                  <div className="p-2 bg-white border-t border-gray-100">
                    <p className="text-xs text-gray-500 truncate">{item.file.name}</p>
                  </div>
                </div>
              ))}

              {/* Add more photos button */}
              {uploadState.files.length < MAX_PHOTOS && (
                <div
                  className="relative rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-center min-h-[200px]"
                >
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.gif,.webp"
                    capture="environment"
                    multiple
                    onChange={handleInputChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="text-center p-4">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Добавить ещё фото</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleNewAnalysis}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Отменить
              </button>
              <button
                onClick={handleAnalyze}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                Анализировать {uploadState.files.length > 1 ? `(${uploadState.files.length} фото)` : ''}
              </button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {uploadState.state === 'loading' && (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 mb-4">
              <svg className="animate-spin text-blue-600 w-full h-full" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">{t('analysis.running')}</p>
            {uploadState.fileName && <p className="text-sm text-gray-400 mt-2">{uploadState.fileName}</p>}
          </div>
        )}

        {/* ERROR */}
        {uploadState.state === 'error' && (
          <div className="p-12 text-center bg-red-50 border-t-4 border-red-500">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-900">{t('results.title')}</h3>
            <p className="text-red-700 mt-2 max-w-md mx-auto">{uploadState.error}</p>
            <div className="mt-6 flex gap-3 justify-center">
              <button onClick={handleRetry} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                {t('actions.tryAgain')}
              </button>
              <button onClick={handleNewAnalysis} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                {t('uploaderCTA')}
              </button>
            </div>
          </div>
        )}

        {/* RESULT */}
        {uploadState.state === 'result' && uploadState.result && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('results.title')}</h2>
              <div className="flex gap-2">
                <button onClick={handleNewAnalysis} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
                  {t('actions.newAnalysis')}
                </button>
                <button onClick={handleGenerateLetter} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                  {t('actions.generateLetter')}
                </button>
              </div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{uploadState.fileName}</p>
                  <p className="text-sm text-gray-500">{new Date().toLocaleDateString(locale)}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('results.sender')}</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{uploadState.result.sender || '—'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('results.type')}</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{uploadState.result.document_type || '—'}</p>
                </div>
                {(uploadState.result.deadline || uploadState.result.urgency) && (
                  <div className="pt-4 border-t border-gray-100">
                    {uploadState.result.deadline && (
                      <div className="mb-3">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('results.deadline')}</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {new Date(uploadState.result.deadline).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('results.deadline')}</label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border mt-1 ${getUrgencyColor(uploadState.result.urgency)}`}>
                        {getUrgencyLabel(uploadState.result.urgency)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('results.title')}</label>
                <p className="mt-2 text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {uploadState.result.summary || '—'}
                </p>
              </div>

              {(uploadState.result.key_points?.length || 0) > 0 && (
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('results.keyPoints')}</label>
                  <ul className="mt-2 space-y-2">
                    {uploadState.result.key_points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">{i + 1}</span>
                        <p className="text-gray-800 pt-0.5">{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(uploadState.result.required_documents?.length || 0) > 0 && (
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('results.requiredDocs')}</label>
                  <ul className="mt-2 space-y-2">
                    {uploadState.result.required_documents.map((doc, i) => (
                      <li key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <svg className="flex-shrink-0 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-800">{doc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="md:col-span-2">
                <div className="mt-3 space-y-3">
                  <button onClick={handleGenerateLetter} className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium text-lg flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 01-2-2V7a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V5a1 1 0 00-1-1h3a1 1 0 001-1V4z" />
                    </svg>
                    {t('actions.generateLetter')}
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button onClick={() => window.print()} className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>{t('actions.savePdf')}</span>
                    </button>
                    <button onClick={() => { const title = encodeURIComponent(uploadState.result?.summary || 'AmtHelper Termin'); window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}`, '_blank'); }} className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Google Calendar</span>
                    </button>
                    <button onClick={() => { navigator.clipboard?.writeText(window.location.href); }} className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>Поделиться</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Documents */}
        {recentDocuments.length > 0 && uploadState.state !== 'loading' && (
          <div className="border-t border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('history.title')}</h3>
            </div>
            <div className="divide-y divide-gray-100 px-6 py-4">
              {recentDocuments.slice(0, 5).map((doc) => (
                <div key={doc.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.file_name}</p>
                      <p className="text-sm text-gray-500">{doc.organization_type} • {new Date(doc.processed_at).toLocaleDateString(locale)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                    doc.deadline_date ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>
                    {doc.deadline_date ? new Date(doc.deadline_date).toLocaleDateString(locale) : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentDocuments.length === 0 && uploadState.state === 'idle' && (
          <div className="border-t border-gray-200 p-6 text-center text-gray-500">
            {t('analysis.selectFile')}
          </div>
        )}
      </div>
    </div>
  );
}
