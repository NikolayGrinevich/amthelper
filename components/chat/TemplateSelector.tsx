'use client';

import { TEMPLATES } from '@/lib/templates';
import { TemplateType } from '@/types';

interface TemplateSelectorProps {
  selected: TemplateType | null;
  onSelect: (t: TemplateType) => void;
}

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto',
      paddingBottom: '0.5rem',
      scrollbarWidth: 'thin',
    }}>
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.875rem',
            borderRadius: '999px',
            border: '1px solid',
            borderColor: selected === t.id ? 'var(--accent)' : 'var(--border)',
            background: selected === t.id ? 'var(--accent-dim)' : 'var(--surface-2)',
            color: selected === t.id ? 'var(--accent-hover)' : 'var(--text-secondary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontSize: '0.8125rem',
            fontWeight: '500',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
        >
          <span>{t.icon}</span>
          <span>{t.name}</span>
        </button>
      ))}
    </div>
  );
}
