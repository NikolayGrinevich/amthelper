'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { useState, useMemo } from 'react';

interface SidebarClientProps {
  locale: string;
  nav: {
    dashboard: string;
    analyzer: string;
    deadline: string;
    checklist: string;
    letter: string;
    templates: string;
    billing: string;
  };
}

const menuItems: { href: string; labelKey: keyof SidebarClientProps['nav']; icon: string }[] = [
  { href: '/dashboard', labelKey: 'dashboard', icon: '📊' },
  { href: '/modules/document-analyzer', labelKey: 'analyzer', icon: '📄' },
  { href: '/modules/deadline-tracker', labelKey: 'deadline', icon: '⏰' },
  { href: '/modules/checklist', labelKey: 'checklist', icon: '✅' },
  { href: '/modules/letter-generator', labelKey: 'letter', icon: '✍️' },
  { href: '/modules/templates', labelKey: 'templates', icon: '📋' },
  { href: '/modules/billing', labelKey: 'billing', icon: '💳' },
];

export function SidebarClient({ locale, nav }: SidebarClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.push(`/${locale}/auth/signin`);
  };

  const activeItem = useMemo(() => {
    return menuItems.find(item => pathname.startsWith(`/${locale}${item.href}`));
  }, [pathname, locale]);

  // Mock urgent deadlines count — in real app this comes from context
  const urgentDeadlines = 0;

  if (loading) return <div style={{ width: isOpen ? '256px' : '72px', minHeight: '100vh', background: 'var(--color-sidebar-bg)' }} />;
  if (!isAuthenticated) return null;

  return (
    <div
      style={{ background: 'var(--color-sidebar-bg)' }}
      className={`${isOpen ? 'w-64' : 'w-20'} text-white transition-all duration-300 min-h-screen flex flex-col relative`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-sidebar-divider)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl flex-shrink-0">🛡️</span>
          {isOpen && (
            <div className="min-w-0">
              <h2 className="text-base font-bold" style={{ color: 'var(--color-sidebar-text-active)' }}>
                AmtHelper
              </h2>
              <p className="text-xs truncate" style={{ color: 'var(--color-sidebar-text)' }}>
                Ihr Assistent
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded transition flex-shrink-0"
          style={{ color: 'var(--color-sidebar-icon)' }}
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeItem?.href === item.href;
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              style={{
                background: isActive ? 'var(--color-sidebar-active)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--color-sidebar-active-border)' : '2px solid transparent',
                color: isActive ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text)',
              }}
              className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-150 text-sm ${
                isOpen ? '' : 'justify-center px-2'
              }`}
            >
              <span className="text-lg flex-shrink-0" style={{ color: isActive ? 'var(--color-sidebar-accent)' : 'var(--color-sidebar-icon)' }}>
                {item.icon}
              </span>
              {isOpen && (
                <span className="truncate flex-1 font-medium">{nav[item.labelKey]}</span>
              )}
              {isOpen && item.href === '/modules/deadline-tracker' && urgentDeadlines > 0 && (
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full"
                  style={{ background: 'var(--color-danger)', color: '#fff' }}>
                  {urgentDeadlines}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade block (if free tier) */}
      {isOpen && user?.role === 'free' && (
        <div className="mx-3 mb-3 p-3 rounded-lg" style={{ background: 'var(--color-sidebar-upgrade-bg)' }}>
          <Link href={`/${locale}/modules/billing`} className="block">
            <p className="text-sm font-medium" style={{ color: 'var(--color-sidebar-accent)' }}>
              {locale === 'de' ? 'Upgrade auf Pro' : 'Upgrade to Pro'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-sidebar-text)' }}>
              {locale === 'de' ? 'Alle Funktionen freischalten' : 'Unlock all features'}
            </p>
          </Link>
        </div>
      )}

      {/* User & Logout */}
      <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid var(--color-sidebar-divider)' }}>
        {isOpen && (
          <div className="mb-3 pb-3 text-xs" style={{ borderBottom: '1px solid var(--color-sidebar-divider)' }}>
            <p style={{ color: 'var(--color-sidebar-text)' }}>{user?.email}</p>
            <p className="font-medium mt-0.5" style={{ color: user?.role === 'pro' ? 'var(--color-success)' : 'var(--color-sidebar-text)' }}>
              {user?.role?.toUpperCase()}
            </p>
          </div>
        )}

        {/* Language Switcher */}
        <div className="mb-3">
          {isOpen && <p className="text-xs mb-1" style={{ color: 'var(--color-sidebar-text)' }}>Sprache</p>}
          <div className="grid grid-cols-4 gap-1 min-w-0">
            {['de', 'ru', 'uk', 'ro'].map((loc) => (
              <button
                key={loc}
                onClick={() => { window.location.href = `/${loc}/dashboard`; }}
                className="text-xs py-1.5 px-1 rounded transition font-medium"
                style={{
                  background: locale === loc ? 'var(--color-primary)' : 'var(--color-sidebar-active)',
                  color: locale === loc ? '#fff' : 'var(--color-sidebar-text)',
                }}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 rounded-lg transition text-sm font-medium"
          style={{ background: 'rgba(220,38,38,0.15)', color: '#EF4444' }}
        >
          {isOpen ? (
            <span>{locale === 'de' ? 'Abmelden' : locale === 'ru' ? 'Выйти' : locale === 'uk' ? 'Вийти' : 'Logout'}</span>
          ) : (
            <span>🚪</span>
          )}
        </button>
      </div>
    </div>
  );
}
