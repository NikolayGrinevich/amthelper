'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        fontSize: '0.9rem',
        transition: 'color 0.2s',
        display: 'block',
      }}
      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
    >
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
      padding: '3rem 1.5rem 2rem',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '28px', height: '28px',
                background: 'var(--gradient-hero)',
                borderRadius: '7px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={15} color="white" />
              </div>
              <span style={{ fontWeight: '700', fontFamily: 'Montserrat, sans-serif', fontSize: '1rem' }}>AmtHelper</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '260px' }}>
              AI-помощник для русскоязычных в Германии. Объясняем бюрократию, пишем письма.
            </p>
          </div>

          {/* Сервис */}
          <div>
            <h3 style={{ fontSize: '0.8125rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Сервис</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <FooterLink href="/chat">Написать письмо</FooterLink>
              <FooterLink href="/#pricing">Тарифы</FooterLink>
              <FooterLink href="/dashboard">Мои письма</FooterLink>
            </div>
          </div>

          {/* Правовая информация */}
          <div>
            <h3 style={{ fontSize: '0.8125rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Правовая информация</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <FooterLink href="/impressum">Impressum</FooterLink>
              <FooterLink href="/datenschutz">Datenschutz</FooterLink>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            © {new Date().getFullYear()} AmtHelper. Все права защищены.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            🇩🇪 Разработано с соблюдением DSGVO
          </p>
        </div>
      </div>
    </footer>
  );
}
