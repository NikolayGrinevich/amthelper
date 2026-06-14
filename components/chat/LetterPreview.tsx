'use client';

import { GeneratedLetter } from '@/types';
import { Copy, Check, Download, FileText } from 'lucide-react';
import { useState } from 'react';

interface LetterPreviewProps {
  letter: GeneratedLetter;
}

export function LetterPreview({ letter }: LetterPreviewProps) {
  const [copied, setCopied] = useState(false);

  const copyLetter = async () => {
    await navigator.clipboard.writeText(letter.letterDe);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadLetter = () => {
    const content = `Betreff: ${letter.subject}\n\n${letter.letterDe}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `letter-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      background: 'rgba(99,102,241,0.05)',
      border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid rgba(99,102,241,0.15)',
        background: 'rgba(99,102,241,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={14} color="var(--accent)" />
          <span style={{
            fontSize: '0.75rem', fontWeight: '600',
            color: 'var(--accent)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            📄 Письмо на немецком
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <button
            onClick={downloadLetter}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', gap: '0.25rem' }}
            title="Скачать"
          >
            <Download size={13} />
          </button>
          <button
            onClick={copyLetter}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', gap: '0.25rem' }}
            title={copied ? 'Скопировано!' : 'Копировать'}
          >
            {copied ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
            {copied ? 'Скопировано' : 'Копировать'}
          </button>
        </div>
      </div>

      {/* Subject */}
      {letter.subject && (
        <div style={{
          padding: '0.625rem 1rem',
          borderBottom: '1px solid rgba(99,102,241,0.1)',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
        }}>
          <strong style={{ color: 'var(--text-primary)' }}>Betreff:</strong> {letter.subject}
        </div>
      )}

      {/* Letter body */}
      <div style={{
        padding: '1rem',
        fontFamily: '"Georgia", serif',
        fontSize: '0.875rem',
        lineHeight: 1.8,
        color: 'var(--text-primary)',
        whiteSpace: 'pre-wrap',
        maxHeight: '400px',
        overflowY: 'auto',
      }}>
        {letter.letterDe}
      </div>
    </div>
  );
}
