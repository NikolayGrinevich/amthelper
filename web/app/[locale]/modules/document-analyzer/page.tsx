'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

type UploadState = 'idle' | 'loading' | 'result' | 'error';

interface UploadStateData {
  state: UploadState;
  result?: AnalysisResult;
  error?: string;
  fileName?: string;
}

const EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
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

  const handleFileSelect = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) { setUploadState({ state: 'error', error, fileName: file.name }); return; }
    setUploadState({ state: 'loading', fileName: file.name });
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', locale);
      const res = await fetch('/api/documents/analyze', { method: 'POST', body: formData, credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      const analysisResult: AnalysisResult = data.analyzed_data;
      const orgType = data.analyzed_data?.sender || 'Unknown';
      const deadlineDate = data.analyzed_data?.deadline || null;
      const saveRes = await fetch('/api/documents/save-analysis', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ file_name: file.name, file_type: file.type, file_size: file.size, analysis_result: analysisResult, organization_type: orgType, deadline_date: deadlineDate })
      });
      if (saveRes.ok) { const saveData = await saveRes.json(); if (saveData.document) setRecentDocuments(prev => [saveData.document, ...prev]); }
      setUploadState({ state: 'result', result: analysisResult, fileName: file.name });
    } catch (err) { const message = err instanceof Error ? err.message : 'Ошибка анализа'; setUploadState({ state: 'error', error: message, fileName: file.name }); }
  }, [locale]);

  const handleDrag = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true); else if (e.type === 'dragleave') setDragActive(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]); }, [handleFileSelect]);
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) { handleFileSelect(e.target.files[0]); e.target.value = ''; } }, [handleFileSelect ]);
  const handleRetry = useCallback(() => { setUploadState({ state: 'idle' }); }, []);
  const handleNewAnalysis = useCallback(() => { setUploadState({ state: 'idle' }); }, []);
  const handleGenerateLetter = useCallback(() => { router.push(`/${locale}/modules/letter-generator`); }, [router, locale]);

  if (authLoading) return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" /></div>;

  const t = {
    ru: { title: 'Анализ документов', subtitle: 'Загрузите официальное письмо для быстрого анализа', uploadZone: 'Перетащите файл сюда или нажмите для выбора', uploadHint: 'PNG, JPG, GIF, WebP, PDF до 10MB', cameraHint: 'На мобильном — фото с камеры', analyzing: 'Анализируем документ...', analyzingDesc: 'Claude Vision читает письмо и извлекает ключевую информацию', results: 'Результаты анализа', organization: 'Организация', documentType: 'Тип документа', deadline: 'Крайний срок', urgency: 'Срочность', summary: 'Краткое содержание', keyPoints: 'Ключевые моменты', requiredDocs: 'Необходимые документы', actionItems: 'Что нужно сделать', generateLetter: 'Создать ответное письмо', newAnalysis: 'Анализировать другой документ', recentAnalyses: 'Недавние анализы', noRecent: 'Пока нет сохраненных анализов', errorTitle: 'Ошибка анализа', tryAgain: 'Попробовать снова' },
    de: { title: 'Dokumentenanalyse', subtitle: 'Laden Sie einen offiziellen Brief hoch für schnelle Analyse', uploadZone: 'Datei hierher ziehen oder klicken zum Auswählen', uploadHint: 'PNG, JPG, GIF, WebP, PDF bis 10MB', cameraHint: 'Auf Mobile: Foto mit Kamera', analyzing: 'Dokument wird analysiert...', analyzingDesc: 'Claude Vision liest den Brief und extrahiert wichtige Informationen', results: 'Analyseergebnisse', organization: 'Absender', documentType: 'Dokumenttyp', deadline: 'Frist', urgency: 'Dringlichkeit', summary: 'Zusammenfassung', keyPoints: 'Wichtige Punkte', requiredDocs: 'Benötigte Dokumente', actionItems: 'Nächste Schritte', generateLetter: 'Antwortbrief erstellen', newAnalysis: 'Anderes Dokument analysieren', recentAnalyses: 'Letzte Analysen', noRecent: 'Noch keine gespeicherten Analysen', errorTitle: 'Analysefehler', tryAgain: 'Erneut versuchen' },
    uk: { title: 'Аналіз документів', subtitle: 'Завантажте офіційний лист для швидкого аналізу', uploadZone: 'Перетягніть файл сюди або натисніть для вибору', uploadHint: 'PNG, JPG, GIF, WebP, PDF до 10MB', cameraHint: 'На мобільному — фото з камери', analyzing: 'Аналізуємо документ...', analyzingDesc: 'Claude Vision читає лист і витягує ключову інформацію', results: 'Результати аналізу', organization: 'Організація', documentType: 'Тип документа', deadline: 'Кінцевий термін', urgency: 'Терміновість', summary: 'Короткий зміст', keyPoints: 'Ключові моменти', requiredDocs: 'Необхідні документи', actionItems: 'Що потрібно зробити', generateLetter: 'Створити відповідний лист', newAnalysis: 'Проаналізувати інший документ', recentAnalyses: 'Останні аналізи', noRecent: 'Поки немає збережених аналізів', errorTitle: 'Помилка аналізу', tryAgain: 'Спробувати знову' },
    ro: { title: 'Analiză documente', subtitle: 'Încărcați o scrisoare oficială pentru analiză rapidă', uploadZone: 'Trageți fișierul aici sau faceți clic pentru selectare', uploadHint: 'PNG, JPG, GIF, WebP, PDF până la 10MB', cameraHint: 'Pe mobil: foto cu camera', analyzing: 'Analizăm documentul...', analyzingDesc: 'Claude Vision citește scrisoarea și extrage informațiile cheie', results: 'Rezultate analiză', organization: 'Organizație', documentType: 'Tip document', deadline: 'Termen limită', urgency: 'Urgenta', summary: 'Rezumat', keyPoints: 'Puncte cheie', requiredDocs: 'Documente necesare', actionItems: 'Acțiuni necesare', generateLetter: 'Creare răspuns', newAnalysis: 'Analizați alt document', recentAnalyses: 'Analize recente', noRecent: 'Nicio analiză salvată încă', errorTitle: 'Eroare analiză', tryAgain: 'Încercați din nou' },
  }[locale as keyof typeof t] || t.ru;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div><h1 className="text-3xl font-bold text-gray-900">{t.title}</h1><p className="text-gray-600 mt-1">{t.subtitle}</p></div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {uploadState.state === 'idle' && (
          <div className={`relative p-12 text-center transition-all duration-200 ${dragActive ? 'bg-blue-50 border-2 border-blue-400' : 'border-2 border-dashed border-gray-300 hover:border-blue-400'}`} onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}>
            <input ref={fileInputRef} type="file" id="file-upload" accept=".pdf,.png,.jpg,.jpeg,.gif,.webp" capture="environment" onChange={handleInputChange} className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Upload document" />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4"><svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg></div>
              <p className="text-lg font-medium text-gray-900">{t.uploadZone}</p><p className="text-sm text-gray-500 mt-1">{t.uploadHint}</p><p className="text-xs text-gray-400 mt-2">{t.cameraHint}</p>
            </label>
          </div>
        )}
        {uploadState.state === 'loading' && (
          <div className="p-12 text-center"><div className="mx-auto w-16 h-16 mb-4"><svg className="animate-spin text-blue-600 w-full h-full" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg></div><p className="text-lg font-medium text-gray-900">{t.analyzing}</p><p className="text-gray-500 mt-1">{t.analyzingDesc}</p>{uploadState.fileName && <p className="text-sm text-gray-400 mt-2">{uploadState.fileName}</p>}</div>
        )}
        {uploadState.state === 'error' && (
          <div className="p-12 text-center bg-red-50 border-t-4 border-red-500"><div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"><svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></div><h3 className="text-xl font-semibold text-red-900">{t.errorTitle}</h3><p className="text-red-700 mt-2 max-w-md mx-auto">{uploadState.error}</p><div className="mt-6 flex gap-3 justify-center"><button onClick={handleRetry} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">{t.tryAgain}</button><button onClick={handleNewAnalysis} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">{t.uploadZone}</button></div></div>
        )}
        {uploadState.state === 'result' && uploadState.result && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-gray-900">{t.results}</h2><div className="flex gap-2"><button onClick={handleNewAnalysis} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">{t.newAnalysis}</button><button onClick={handleGenerateLetter} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">{t.generateLetter}</button></div></div>
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg></div><div><p className="font-medium text-gray-900">{uploadState.fileName}</p><p className="text-sm text-gray-500">Проанализирован • {new Date().toLocaleDateString(locale)}</p></div></div></div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4"><div><label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.organization}</label><p className="text-lg font-semibold text-gray-900 mt-1">{uploadState.result.sender || '—'}</p></div><div><label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.documentType}</label><p className="text-lg font-semibold text-gray-900 mt-1">{uploadState.result.document_type || '—'}</p></div>{(uploadState.result.deadline || uploadState.result.urgency) && (<div className="pt-4 border-t border-gray-100">{uploadState.result.deadline && (<div className="mb-3"><label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.deadline}</label><p className="text-lg font-semibold text-gray-900 mt-1">{new Date(uploadState.result.deadline).toLocaleDateString(locale, {day:'2-digit',month:'2-digit',year:'numeric'})}</p></div>)}<div><label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.urgency}</label><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border mt-1 ${getUrgencyColor(uploadState.result.urgency)}`}>{getUrgencyLabel(uploadState.result.urgency)}</span></div></div>)}</div>
              <div className="md:col-span-2"><label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.summary}</label><p className="mt-2 text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{uploadState.result.summary || '—'}</p></div>
              {(uploadState.result.key_points?.length || 0) > 0 && (<div className="md:col-span-2"><label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.keyPoints}</label><ul className="mt-2 space-y-2">{uploadState.result.key_points.map((point, i) => (<li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"><span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">{i + 1}</span><p className="text-gray-800 pt-0.5">{point}</p></li>))}</ul></div>)}
              {(uploadState.result.required_documents?.length || 0) > 0 && (<div className="md:col-span-2"><label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.requiredDocs}</label><ul className="mt-2 space-y-2">{uploadState.result.required_documents.map((doc, i) => (<li key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"><svg className="flex-shrink-0 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><p className="text-gray-800">{doc}</p></li>))}</ul></div>)}
              <div className="md:col-span-2"><label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.actionItems}</label><div className="mt-3 space-y-3"><button onClick={handleGenerateLetter} className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium text-lg flex items-center justify-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 01-2-2V7a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V5a1 1 0 00-1-1h3a1 1 0 001-1V4z" /></svg>{t.generateLetter}</button><div className="grid grid-cols-1 md:grid-cols-3 gap-3"><button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm flex items-center justify-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg><span>Сохранить как PDF</span></button><button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm flex items-center justify-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg><span>Добавить в календарь</span></button><button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm flex items-center justify-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg><span>Поделиться</span></button></div></div></div>
            </div>
          </div>
        )}
        {recentDocuments.length > 0 && uploadState.state !== 'loading' && (<div className="border-t border-gray-200"><div className="p-6"><h3 className="text-lg font-semibold text-gray-900">{t.recentAnalyses}</h3></div><div className="divide-y divide-gray-100 px-6 py-4">{recentDocuments.slice(0,5).map((doc) => (<div key={doc.id} className="py-3 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg></div><div><p className="font-medium text-gray-900">{doc.file_name}</p><p className="text-sm text-gray-500">{doc.organization_type} • {new Date(doc.processed_at).toLocaleDateString(locale)}</p></div></div><span className={`px-2 py-1 text-xs font-medium rounded-full border ${doc.deadline_date ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{doc.deadline_date ? `До ${new Date(doc.deadline_date).toLocaleDateString(locale)}` : 'Без срока'}</span></div>))}</div></div>)}
        {recentDocuments.length === 0 && uploadState.state === 'idle' && (<div className="border-t border-gray-200 p-6 text-center text-gray-500">{t.noRecent}</div>)}
      </div>
    </div>
  );
}