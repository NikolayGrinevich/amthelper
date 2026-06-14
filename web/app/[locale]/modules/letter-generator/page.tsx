'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';

interface AnalyzedDocument {
  id: string;
  user_id: string;
  document_id: string | null;
  file_name: string | null;
  analysis_result: {
    sender: string;
    recipient: string;
    document_type: string;
    key_points: string[];
    deadline: string | null;
    required_documents: string[];
    urgency: 'low' | 'medium' | 'high' | 'critical';
    summary: string;
    sender_name?: string;
    sender_address?: string;
    recipient_address?: string;
    document_date?: string;
    reference_number?: string;
  } | null;
  organization_type: string | null;
  deadline_date: string | null;
  processed_at: string;
}

interface GeneratedLetter {
  id: string;
  content: string;
  template_type: 'Widerspruch' | 'Antrag' | 'Nachfrage' | 'Beschwerde';
  recipient: string;
  status: 'draft' | 'sent' | 'archived';
  created_at: string;
}

type TemplateType = 'Widerspruch' | 'Antrag' | 'Nachfrage' | 'Beschwerde';

interface TemplateOption {
  value: TemplateType;
  label: string;
  description: string;
  icon: string;
}

const TEMPLATE_OPTIONS: Record<string, { ru: TemplateOption[]; de: TemplateOption[]; uk: TemplateOption[]; ro: TemplateOption[] }> = {
  ru: [
    { value: 'Widerspruch', label: 'Возражение (Widerspruch)', description: 'Оспаривание решения органа власти', icon: '⚖️' },
    { value: 'Antrag', label: 'Заявление (Antrag)', description: 'Запрос на предоставление права/услуги', icon: '📝' },
    { value: 'Nachfrage', label: 'Запрос информации (Nachfrage)', description: 'Уточнение деталей по существующему делу', icon: '❓' },
    { value: 'Beschwerde', label: 'Жалоба (Beschwerde)', description: 'Жалоба на действия/бездействие органа', icon: '📢' },
  ],
  de: [
    { value: 'Widerspruch', label: 'Widerspruch', description: 'Gegen einen Bescheid vorgehen', icon: '⚖️' },
    { value: 'Antrag', label: 'Antrag', description: 'Leistung oder Recht beantragen', icon: '📝' },
    { value: 'Nachfrage', label: 'Nachfrage', description: 'Informationen bei Behörde einholen', icon: '❓' },
    { value: 'Beschwerde', label: 'Beschwerde', description: 'Über Behörde/Verwaltung beschweren', icon: '📢' },
  ],
  uk: [
    { value: 'Widerspruch', label: 'Відповідь (Widerspruch)', description: 'Скарга на рішення органу влади', icon: '⚖️' },
    { value: 'Antrag', label: 'Заява (Antrag)', description: 'Запит на надання права/послуги', icon: '📝' },
    { value: 'Nachfrage', label: 'Запит інформації (Nachfrage)', description: 'Уточнення деталей по існуючій справі', icon: '❓' },
    { value: 'Beschwerde', label: 'Скарга (Beschwerde)', description: 'Скарга на дії/бездіяльність органу', icon: '📢' },
  ],
  ro: [
    { value: 'Widerspruch', label: 'Contestație (Widerspruch)', description: 'Contestarea unei hotărâri a autorității', icon: '⚖️' },
    { value: 'Antrag', label: 'Cerere (Antrag)', description: 'Solicitare de drept/serviciu', icon: '📝' },
    { value: 'Nachfrage', label: 'Întrebare (Nachfrage)', description: 'Clarificare detalii dosar existent', icon: '❓' },
    { value: 'Beschwerde', label: 'Plângere (Beschwerde)', description: 'Plângere împotriva autorității', icon: '📢' },
  ],
};

const t = {
  ru: {
    title: 'Генератор писем',
    subtitle: 'Создавайте официальные немецкие письма на основе анализа документов',
    selectTemplate: 'Выберите тип письма',
    templateDescription: 'Шаблон определяет структуру и тон письма',
    recipient: 'Получатель',
    recipientPlaceholder: 'Название органа, адрес, контактное лицо...',
    generate: 'Сгенерировать письмо',
    generating: 'Генерация...',
    preview: 'Предпросмотр письма',
    edit: 'Редактировать',
    copy: 'Копировать',
    download: 'Скачать TXT',
    save: 'Сохранить',
    saved: 'Сохранено!',
    error: 'Ошибка генерации',
    needRecipient: 'Укажите получателя',
    needTemplate: 'Выберите тип письма',
    fromAnalyzer: 'Данные подгружены из анализа документа',
    letterSaved: 'Письмо сохранено в истории',
    copySuccess: 'Скопировано в буфер обмена',
  },
  de: {
    title: 'Briefgenerator',
    subtitle: 'Erstellen Sie formelle deutsche Briefe basierend auf Dokumentenanalyse',
    selectTemplate: 'Briefart wählen',
    templateDescription: 'Die Vorlage bestimmt Struktur und Ton des Briefs',
    recipient: 'Empfänger',
    recipientPlaceholder: 'Behörde / Name / Straße / PLZ / Ort',
    generate: 'Brief erstellen',
    generating: 'Brief wird generiert...',
    preview: 'Briefvorschau',
    edit: 'Bearbeiten',
    copy: 'Kopieren',
    download: 'Als TXT herunterladen',
    save: 'Speichern',
    saved: 'Gespeichert!',
    error: 'Fehler bei der Generierung',
    needRecipient: 'Bitte Empfänger angeben',
    needTemplate: 'Bitte Briefart wählen',
    fromAnalyzer: 'Daten aus Dokumentenanalyse geladen',
    letterSaved: 'Brief im Verlauf gespeichert',
    copySuccess: 'In Zwischenablage kopiert',
  },
  uk: {
    title: 'Генератор листів',
    subtitle: 'Створюйте офіційні німецькі листи на основі аналізу документів',
    selectTemplate: 'Оберіть тип листа',
    templateDescription: 'Шаблон визначає структуру і тон листа',
    recipient: 'Одержувач',
    recipientPlaceholder: 'Назва органу, адреса, контактна особа...',
    generate: 'Згенерувати лист',
    generating: 'Генерація...',
    preview: 'Попередній перегляд листа',
    edit: 'Редагувати',
    copy: 'Копіювати',
    download: 'Завантажити TXT',
    save: 'Зберегти',
    saved: 'Збережено!',
    error: 'Помилка генерації',
    needRecipient: 'Вкажіть одержувача',
    needTemplate: 'Оберіть тип листа',
    fromAnalyzer: 'Дані завантажені з аналізу документа',
    letterSaved: 'Лист збережено в історії',
    copySuccess: 'Скопійовано в буфер обміну',
  },
  ro: {
    title: 'Generator de scrisori',
    subtitle: 'Creați scrisori germane oficiale pe baza analizei documentelor',
    selectTemplate: 'Selectați tipul scrisorii',
    templateDescription: 'Șablonul determină structura și tonul scrisorii',
    recipient: 'Destinatar',
    recipientPlaceholder: 'Instituție / Nume / Adresă / Persoană de contact...',
    generate: 'Generează scrisoarea',
    generating: 'Generare...',
    preview: 'Previzualizare scrisoare',
    edit: 'Editează',
    copy: 'Copiază',
    download: 'Descarcă TXT',
    save: 'Salvează',
    saved: 'Salvat!',
    error: 'Eroare la generare',
    needRecipient: 'Specificați destinatarul',
    needTemplate: 'Selectați tipul scrisorii',
    fromAnalyzer: 'Date încărcate din analiza documentului',
    letterSaved: 'Scrisoarea salvată în istoric',
    copySuccess: 'Copiat în clipboard',
  },
};

export default function LetterGeneratorPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = pathname.split('/')[1];
  const { user, loading: authLoading } = useAuth();

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [recipient, setRecipient] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetter | null>(null);
  const [sourceDoc, setSourceDoc] = useState<AnalyzedDocument | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const translations = t[locale as keyof typeof t] || t.ru;
  const templateOptions = TEMPLATE_OPTIONS[locale as keyof typeof TEMPLATE_OPTIONS] || TEMPLATE_OPTIONS.ru;

  const showToastMsg = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load source document from URL params
  useEffect(() => {
    const docId = searchParams.get('id');
    if (fromDoc === 'document' && docId && user) {
      loadSourceDocument(docId);
    }
  }, [searchParams, user]);

  const loadSourceDocument = async (docId: string) => {
    try {
      const res = await fetch('/api/documents/analyzed', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const doc = data.documents?.find((d: AnalyzedDocument) => d.id === docId);
        if (doc && doc.analysis_result) {
          setSourceDoc(doc);
          const analysis = doc.analysis_result;
          const recipientParts = [
            analysis.sender,
            analysis.recipient,
            analysis.sender_address,
          ].filter(Boolean);
          setRecipient(recipientParts.join(', '));
        }
      }
    } catch (err) {
      console.error('Failed to load source document:', err);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      showToastMsg(translations.needTemplate);
      return;
    }
    if (!recipient.trim()) {
      showToastMsg(translations.needRecipient);
      return;
    }
    if (!sourceDoc?.id) {
      showToastMsg('Нет исходного документа для генерации');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/documents/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          template_type: selectedTemplate,
          analyzed_document_id: sourceDoc.id,
          locale,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || translations.error);

      setGeneratedContent(data.content);
      setGeneratedLetter({
        id: data.id,
        content: data.content,
        template_type: data.template_type,
        recipient: data.recipient,
        status: data.status,
        created_at: data.created_at,
      });
      setIsEditing(true);
      showToastMsg(translations.letterSaved);
    } catch (err) {
      console.error('Generate error:', err);
      showToastMsg(err instanceof Error ? err.message : translations.error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedContent) return;
    await navigator.clipboard.writeText(generatedContent);
    showToastMsg(translations.copySuccess);
  };

  const handleDownload = () => {
    if (!generatedContent) return;
    const blob = new Blob([generatedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const templateLabel = templateOptions.find(t => t.value === selectedTemplate)?.label || selectedTemplate || 'letter';
    a.download = `${templateLabel.replace(/[()]/g, '').trim()}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    if (!generatedLetter) return;
    showToastMsg(translations.letterSaved);
  };

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
        <h1 className="text-3xl font-bold text-gray-900">{translations.title}</h1>
        <p className="text-gray-600 mt-1">{translations.subtitle}</p>
      </div>

      {sourceDoc && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-blue-900">{translations.fromAnalyzer}</p>
              <p className="text-sm text-blue-700">{sourceDoc.file_name || 'Неизвестный документ'}</p>
            </div>
            <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              {sourceDoc.analysis_result?.sender || sourceDoc.organization_type || 'Неизвестный источник'}
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {!generatedLetter ? (
          <div className="p-8 space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">{translations.selectTemplate}</label>
              <p className="text-sm text-gray-500 mb-4">{translations.templateDescription}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templateOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedTemplate(option.value)}
                    className={`relative p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedTemplate === option.value
                        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gray-100">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{option.label}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
                      </div>
                      {selectedTemplate === option.value && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{translations.recipient}</label>
              <textarea
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={translations.recipientPlaceholder}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedTemplate || !recipient.trim() || !sourceDoc?.id}
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-lg flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {translations.generating}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 01-2-2V7a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V5a1 1 0 00-1-1h3a1 1 0 001-1V4z" />
                    </svg>
                    {translations.generate}
                  </>
                )}
              </button>
              {!sourceDoc?.id && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Сначала загрузите и проанализируйте документ в <a href={`/${locale}/modules/document-analyzer`} className="text-blue-600 hover:underline">Анализаторе документов</a>
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{translations.preview}</h2>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mt-2">
                  {templateOptions.find(t => t.value === generatedLetter?.template_type)?.icon}
                  {generatedLetter?.template_type}
                </span>
              </div>
              <button
                onClick={() => { setGeneratedLetter(null); setGeneratedContent(''); setIsEditing(false); }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                ← Новое письмо
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100" />

            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 min-h-[400px] font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {isEditing ? (
                <textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none resize-none min-h-[400px] text-gray-900"
                  spellCheck={false}
                />
              ) : (
                <div className="text-gray-900">{generatedContent}</div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleCopy}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M16 12h.01M12 12h.01M8 12h.01M16 8h.01M12 8h.01M8 8h.01" />
                </svg>
                {translations.copy}
              </button>
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {translations.download}
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {translations.save}
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium flex items-center gap-2 ml-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {isEditing ? 'Готово' : translations.edit}
              </button>
            </div>
          </div>
        )}
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-up z-50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {toastMessage}
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
}