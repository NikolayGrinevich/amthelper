'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(10, 10, 15, 0.9)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'var(--gradient-hero)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={18} color="white" />
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'Montserrat, sans-serif' }}>
              AmtHelper
            </span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
            <Link href="/#how-it-works" className="btn btn-ghost btn-sm">Как это работает</Link>
            <Link href="/#pricing" className="btn btn-ghost btn-sm">Цены</Link>
            <Link href="/impressum" className="btn btn-ghost btn-sm">Impressum</Link>
            <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 0.25rem' }} />
            <Link href="/auth/login" className="btn btn-secondary btn-sm">Войти</Link>
            <Link href="/chat" className="btn btn-primary btn-sm">Начать бесплатно</Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-ghost btn-sm mobile-menu-btn"
            aria-label="Меню"
            style={{ display: 'none' }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div style={{
          background: 'rgba(10, 10, 15, 0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          <Link href="/#how-it-works" className="btn btn-ghost" onClick={() => setIsOpen(false)}>Как это работает</Link>
          <Link href="/#pricing" className="btn btn-ghost" onClick={() => setIsOpen(false)}>Цены</Link>
          <Link href="/auth/login" className="btn btn-secondary" onClick={() => setIsOpen(false)}>Войти</Link>
          <Link href="/chat" className="btn btn-primary" onClick={() => setIsOpen(false)}>Начать бесплатно</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
