'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X, Check } from 'lucide-react';

type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem('amt_cookie_consent');
    if (!stored) {
      setTimeout(() => setVisible(true), 1500);
    }
  }, []);

  const saveConsent = (c: ConsentState) => {
    localStorage.setItem('amt_cookie_consent', JSON.stringify({ ...c, timestamp: Date.now() }));
    setVisible(false);
  };

  const acceptAll = () => saveConsent({ necessary: true, analytics: true, marketing: true });
  const acceptNecessary = () => saveConsent({ necessary: true, analytics: false, marketing: false });
  const saveCustom = () => saveConsent(consent);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      maxWidth: '520px',
      margin: '0 auto',
      animation: 'fadeInUp 0.4s ease forwards',
    }}>
      <div className="glass" style={{
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        border: '1px solid var(--border-hover)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'var(--accent-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Cookie size={20} color="var(--accent)" />
          </div>
          <div>
            <h3 style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>
              Cookies & Datenschutz
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Мы используем cookies для работы сервиса. Подробнее в{' '}
              <Link href="/datenschutz" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                Datenschutzerklärung
              </Link>.
            </p>
          </div>
        </div>

        {showDetails && (
          <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {[
              { key: 'necessary', label: 'Необходимые', desc: 'Авторизация, безопасность', locked: true },
              { key: 'analytics', label: 'Аналитика', desc: 'Улучшение сервиса', locked: false },
              { key: 'marketing', label: 'Маркетинг', desc: 'Персонализированная реклама', locked: false },
            ].map(({ key, label, desc, locked }) => (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.625rem 0.875rem',
                background: 'var(--surface-2)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
              }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{desc}</div>
                </div>
                <button
                  disabled={locked}
                  onClick={() => !locked && setConsent(c => ({ ...c, [key]: !c[key as keyof ConsentState] }))}
                  style={{
                    width: '40px', height: '22px',
                    borderRadius: '11px',
                    border: 'none',
                    cursor: locked ? 'default' : 'pointer',
                    background: (locked || consent[key as keyof ConsentState])
                      ? 'var(--accent)'
                      : 'var(--surface-3)',
                    transition: 'background 0.2s ease',
                    position: 'relative',
                  }}
                  aria-label={`Toggle ${label}`}
                >
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    left: (locked || consent[key as keyof ConsentState]) ? '20px' : '2px',
                    width: '18px', height: '18px',
                    borderRadius: '50%',
                    background: 'white',
                    transition: 'left 0.2s ease',
                  }} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {showDetails ? (
            <>
              <button onClick={acceptNecessary} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Только необходимые
              </button>
              <button onClick={saveCustom} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                <Check size={14} /> Сохранить
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowDetails(true)} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>
                Настроить
              </button>
              <button onClick={acceptNecessary} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Только необходимые
              </button>
              <button onClick={acceptAll} className="btn btn-primary btn-sm" style={{ flex: 2 }}>
                Принять все
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
