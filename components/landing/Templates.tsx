import Link from 'next/link';
import { TEMPLATES } from '@/lib/templates';

export function Templates() {
  return (
    <section style={{ padding: '6rem 1.5rem', background: 'var(--background)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.25rem 0.875rem',
            background: 'var(--accent-dim)',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '1rem',
          }}>
            5 категорий
          </div>
          <h2 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: '800',
            marginBottom: '1rem',
          }}>
            Для каких ведомств пишем
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: '500px', margin: '0 auto' }}>
            Самые частые ситуации с немецкой бюрократией — уже готовы
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {TEMPLATES.map((template, i) => (
            <Link
              key={template.id}
              href={`/chat?template=${template.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="card glass-hover" style={{
                cursor: 'pointer',
                background: `linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)`,
                transition: 'all 0.3s ease',
                height: '100%',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    fontSize: '2rem',
                    width: '52px', height: '52px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `var(--gradient-card)`,
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    flexShrink: 0,
                  }}>
                    {template.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '0.125rem' }}>
                      {template.nameRu}
                    </div>
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: '700' }}>{template.name}</h3>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                  {template.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {template.examples.map((ex) => (
                    <div key={ex} style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      fontSize: '0.8125rem', color: 'var(--text-muted)',
                    }}>
                      <span style={{ color: 'var(--accent)', fontSize: '0.625rem' }}>◆</span>
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
