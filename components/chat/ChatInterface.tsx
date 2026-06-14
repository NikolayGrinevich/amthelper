'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, TemplateType } from '@/types';
import { TemplateSelector } from './TemplateSelector';
import { MessageBubble } from './MessageBubble';
import { Send, Sparkles, AlertCircle } from 'lucide-react';
import { TEMPLATE_MAP } from '@/lib/templates';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Привет! Я AmtHelper — AI-помощник по немецкой бюрократии. Выберите категорию выше и опишите вашу ситуацию на русском языке. Я объясню что нужно делать и напишу официальное письмо на немецком.',
  createdAt: new Date(),
};

interface ChatInterfaceProps {
  initialTemplate?: TemplateType;
  isPro?: boolean;
  lettersThisMonth?: number;
}

export function ChatInterface({ initialTemplate, isPro = false, lettersThisMonth = 0 }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(initialTemplate || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const FREE_LIMIT = 3;
  const canSend = isPro || lettersThisMonth < FREE_LIMIT;
  const remaining = Math.max(0, FREE_LIMIT - lettersThisMonth);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !canSend) return;
    if (!selectedTemplate) {
      setError('Пожалуйста, выберите категорию письма выше');
      return;
    }

    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date(),
    };

    const loadingMessage: Message = {
      id: 'loading',
      role: 'assistant',
      content: '...',
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: selectedTemplate, userInput: userMessage.content }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Ошибка генерации');
      }

      const { letter } = await res.json();

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: letter.explanation,
        letter,
        createdAt: new Date(),
      };

      setMessages((prev) => prev.filter((m) => m.id !== 'loading').concat(assistantMessage));
    } catch (err: any) {
      setMessages((prev) => prev.filter((m) => m.id !== 'loading'));
      setError(err.message || 'Что-то пошло не так. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentTemplate = selectedTemplate ? TEMPLATE_MAP[selectedTemplate] : null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)',
      maxWidth: '860px',
      margin: '0 auto',
      padding: '0 1rem',
    }}>
      {/* Template selector */}
      <div style={{
        padding: '1rem 0 0.75rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>
          ВЫБЕРИТЕ КАТЕГОРИЮ
        </div>
        <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />
      </div>

      {/* Usage indicator */}
      {!isPro && (
        <div style={{
          padding: '0.5rem 0',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {canSend ? (
              <>Бесплатных писем: <strong style={{ color: remaining <= 1 ? 'var(--warning)' : 'var(--text-secondary)' }}>{remaining} из {FREE_LIMIT}</strong> в этом месяце</>
            ) : (
              <span style={{ color: 'var(--warning)' }}>⚠️ Лимит исчерпан. Перейдите на Pro для безлимитных писем.</span>
            )}
          </div>
          {!canSend && (
            <a href="/auth/login?redirect=pro" className="btn btn-primary btn-sm">
              <Sparkles size={13} /> Upgrade to Pro
            </a>
          )}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 0' }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: '#fca5a5',
          }}>
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{
        padding: '1rem 0 1.5rem',
        borderTop: '1px solid var(--border)',
      }}>
        {currentTemplate && (
          <div style={{
            fontSize: '0.75rem', color: 'var(--text-muted)',
            marginBottom: '0.5rem',
            display: 'flex', alignItems: 'center', gap: '0.375rem',
          }}>
            {currentTemplate.icon} {currentTemplate.name} — {currentTemplate.nameRu}
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '0.625rem',
          alignItems: 'flex-end',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '0.5rem',
          transition: 'border-color 0.2s ease',
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              !selectedTemplate
                ? 'Сначала выберите категорию выше...'
                : canSend
                ? 'Опишите вашу ситуацию на русском языке... (Enter для отправки, Shift+Enter для новой строки)'
                : 'Лимит исчерпан. Перейдите на Pro.'
            }
            disabled={!canSend || isLoading}
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: '0.9375rem',
              resize: 'none',
              padding: '0.375rem 0.5rem',
              lineHeight: 1.6,
              maxHeight: '200px',
              overflowY: 'auto',
            }}
            onInput={(e) => {
              const el = e.target as HTMLTextAreaElement;
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 200) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || !canSend || !selectedTemplate}
            className="btn btn-primary btn-sm"
            style={{
              padding: '0.5rem 0.75rem',
              opacity: (!input.trim() || isLoading || !canSend || !selectedTemplate) ? 0.5 : 1,
              flexShrink: 0,
            }}
            aria-label="Отправить"
          >
            <Send size={16} />
          </button>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.375rem', textAlign: 'center' }}>
          AmtHelper использует AI. Всегда проверяйте письма перед отправкой.
        </div>
      </div>
    </div>
  );
}
