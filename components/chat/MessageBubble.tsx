'use client';

import { Message } from '@/types';
import { Sparkles, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { LetterPreview } from './LetterPreview';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginBottom: '1rem' }}>
        <div style={{
          maxWidth: '70%',
          background: 'var(--accent)',
          color: 'white',
          padding: '0.75rem 1rem',
          borderRadius: '18px 18px 4px 18px',
          fontSize: '0.9rem',
          lineHeight: 1.6,
        }}>
          {message.content}
        </div>
        <div style={{
          width: '32px', height: '32px',
          borderRadius: '50%',
          background: 'var(--surface-3)',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.9rem', alignSelf: 'flex-end',
        }}>
          🙋
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem' }}>
      {/* Avatar */}
      <div style={{
        width: '32px', height: '32px',
        borderRadius: '50%',
        background: 'var(--gradient-hero)',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        alignSelf: 'flex-start',
      }}>
        <Sparkles size={14} color="white" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Explanation */}
        {message.letter ? (
          <>
            <div style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              padding: '0.875rem 1rem',
              borderRadius: '16px 16px 16px 4px',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              marginBottom: '0.75rem',
              color: 'var(--text-primary)',
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
              }}>
                💡 Объяснение
              </div>
              {message.letter.explanation}
            </div>
            <LetterPreview letter={message.letter} />
          </>
        ) : (
          <div style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            padding: '0.875rem 1rem',
            borderRadius: '16px 16px 16px 4px',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            color: message.content === '...' ? 'var(--text-muted)' : 'var(--text-primary)',
          }}>
            {message.content === '...' ? (
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span className="shimmer" style={{ width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block' }} />
                <span className="shimmer" style={{ width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block', animationDelay: '0.15s' }} />
                <span className="shimmer" style={{ width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block', animationDelay: '0.3s' }} />
                <span style={{ marginLeft: '8px', fontSize: '0.875rem' }}>Генерирую письмо...</span>
              </div>
            ) : message.content}
          </div>
        )}
      </div>
    </div>
  );
}
