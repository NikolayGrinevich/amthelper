import { MessageSquare, Sparkles, FileText } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Опишите ситуацию',
    description: 'Напишите на русском что произошло и какое письмо вам нужно. Не нужно знать немецкие термины — просто опишите своими словами.',
  },
  {
    icon: Sparkles,
    number: '02',
    title: 'AI анализирует',
    description: 'Claude AI понимает контекст, выбирает правильный формат и юридическую формулировку для вашей ситуации.',
  },
  {
    icon: FileText,
    number: '03',
    title: 'Получите письмо',
    description: 'Получаете объяснение на русском что будет дальше, и готовое формальное письмо на немецком которое можно сразу отправить.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '6rem 1.5rem', background: 'var(--surface)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
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
            Как это работает
          </div>
          <h2 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: '800',
            marginBottom: '1rem',
          }}>
            Три шага до готового письма
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: '500px', margin: '0 auto' }}>
            Без знания немецкого, без поиска шаблонов, без страха ошибиться
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {steps.map((step, i) => (
            <div key={step.number} className="card glass-hover" style={{
              position: 'relative',
              overflow: 'hidden',
              animationDelay: `${i * 100}ms`,
            }}>
              {/* Step number watermark */}
              <div style={{
                position: 'absolute',
                top: '-0.5rem',
                right: '1rem',
                fontSize: '5rem',
                fontWeight: '900',
                fontFamily: 'Montserrat, sans-serif',
                color: 'rgba(99,102,241,0.06)',
                lineHeight: 1,
                userSelect: 'none',
              }}>
                {step.number}
              </div>

              {/* Icon */}
              <div style={{
                width: '48px', height: '48px',
                borderRadius: '12px',
                background: 'var(--gradient-hero)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem',
                boxShadow: '0 4px 15px var(--accent-glow)',
              }}>
                <step.icon size={22} color="white" />
              </div>

              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                {step.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
