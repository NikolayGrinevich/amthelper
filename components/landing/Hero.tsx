import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Clock } from 'lucide-react';

export function Hero() {
  return (
    <section className="hero-gradient" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8rem 1.5rem 5rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 1rem',
          background: 'var(--accent-dim)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '999px',
          marginBottom: '2rem',
          fontSize: '0.8125rem',
          fontWeight: '600',
          color: 'var(--accent-hover)',
          animation: 'fadeInUp 0.6s ease forwards',
        }}>
          <Sparkles size={13} />
          Работает на Claude AI от Anthropic
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: '900',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          animation: 'fadeInUp 0.6s 100ms ease forwards',
          opacity: 0,
        }}>
          Немецкая бюрократия{' '}
          <span className="gradient-text">на вашем языке</span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.7,
          animation: 'fadeInUp 0.6s 200ms ease forwards',
          opacity: 0,
        }}>
          Напишите на русском что нужно — получите объяснение на русском и{' '}
          <strong style={{ color: 'var(--text-primary)' }}>готовое официальное письмо на немецком</strong>.
          Finanzamt, Ausländerbehörde, Jobcenter — за секунды.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'fadeInUp 0.6s 300ms ease forwards',
          opacity: 0,
        }}>
          <Link href="/chat" className="btn btn-primary btn-lg" style={{ gap: '0.625rem' }}>
            Начать бесплатно
            <ArrowRight size={18} />
          </Link>
          <Link href="/#how-it-works" className="btn btn-secondary btn-lg">
            Как это работает
          </Link>
        </div>

        {/* Trust indicators */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '3rem',
          animation: 'fadeInUp 0.6s 400ms ease forwards',
          opacity: 0,
        }}>
          {[
            { icon: Shield, text: 'DSGVO-совместимо' },
            { icon: Clock, text: '< 30 секунд на письмо' },
            { icon: Sparkles, text: '5 категорий писем' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <Icon size={15} color="var(--accent)" />
              {text}
            </div>
          ))}
        </div>

        {/* Demo preview card */}
        <div style={{
          marginTop: '4rem',
          animation: 'fadeInUp 0.8s 500ms ease forwards',
          opacity: 0,
        }}>
          <div className="glass glass-hover" style={{
            borderRadius: '20px',
            padding: '1.5rem',
            textAlign: 'left',
            maxWidth: '600px',
            margin: '0 auto',
            boxShadow: 'var(--shadow-glow)',
          }}>
            {/* User message */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', justifyContent: 'flex-end' }}>
              <div style={{
                background: 'var(--accent)',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '16px 16px 4px 16px',
                fontSize: '0.875rem',
                maxWidth: '75%',
                lineHeight: 1.5,
              }}>
                Мне нужно написать в Finanzamt чтобы получить Steuer-ID, я только переехал в Германию
              </div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--surface-3)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>🙋</div>
            </div>

            {/* Assistant response */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'var(--gradient-hero)',
                flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={14} color="white" />
              </div>
              <div>
                <div style={{
                  background: 'var(--surface-2)',
                  padding: '0.75rem 1rem',
                  borderRadius: '16px 16px 16px 4px',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  marginBottom: '0.625rem',
                }}>
                  <strong style={{ color: 'var(--accent)' }}>Объяснение:</strong> Steuer-ID (Steueridentifikationsnummer) — это ваш постоянный налоговый номер в Германии. Он присваивается всем жителям и нужен для работы, банка и налоговой декларации...
                </div>
                <div style={{
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.8125rem',
                  fontFamily: 'Georgia, serif',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                }}>
                  <div style={{ color: 'var(--accent)', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>📄 ПИСЬМО НА НЕМЕЦКОМ</div>
                  An das Finanzamt München<br />
                  Betreff: Antrag auf Mitteilung der Steueridentifikationsnummer...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
