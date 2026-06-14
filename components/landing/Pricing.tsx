import Link from 'next/link';
import { Check, Zap } from 'lucide-react';

const FREE_FEATURES = [
  '3 письма в месяц',
  'Все 5 категорий',
  'Объяснение на русском',
  'Копирование письма',
];

const PRO_FEATURES = [
  'Безлимитные письма',
  'Сохранение истории',
  'Экспорт в PDF',
  'Приоритетная генерация',
  'Все будущие категории',
];

export function Pricing() {
  return (
    <section id="pricing" style={{ padding: '6rem 1.5rem', background: 'var(--surface)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
            Тарифы
          </div>
          <h2 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: '800',
            marginBottom: '1rem',
          }}>
            Просто и прозрачно
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem' }}>
            Начните бесплатно, перейдите на Pro когда нужно
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {/* Free */}
          <div className="card" style={{ border: '1px solid var(--border)' }}>
            <div className="badge badge-free" style={{ marginBottom: '1.5rem' }}>Бесплатно</div>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'Montserrat, sans-serif' }}>€0</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}> / месяц</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Идеально чтобы попробовать сервис
            </p>
            <div className="divider" />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {FREE_FEATURES.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9rem' }}>
                  <Check size={16} color="var(--success)" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/chat" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Начать бесплатно
            </Link>
          </div>

          {/* Pro */}
          <div style={{
            borderRadius: '16px',
            padding: '1px',
            background: 'var(--gradient-hero)',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <div className="card" style={{ background: 'var(--surface)', borderRadius: '15px', border: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div className="badge badge-pro">Pro</div>
                <div style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.625rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--success)',
                  borderRadius: '999px',
                  fontWeight: '600',
                }}>
                  Популярный выбор
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{
                  fontSize: '2.5rem', fontWeight: '800', fontFamily: 'Montserrat, sans-serif',
                  background: 'var(--gradient-hero)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>€4.99</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}> / месяц</span>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Для тех кто часто имеет дело с немецкими ведомствами
              </p>
              <div className="divider" />
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {PRO_FEATURES.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9rem' }}>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: 'var(--gradient-hero)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Check size={11} color="white" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/login?redirect=pro" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Zap size={16} />
                Оформить Pro
              </Link>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '2rem' }}>
          Отмена в любой момент • Безопасная оплата через Stripe • Никаких скрытых комиссий
        </p>
      </div>
    </section>
  );
}
