'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { useState } from 'react';

interface SidebarClientProps {
  locale: string;
  nav: {
    dashboard: string;
    analyzer: string;
    deadline: string;
    checklist: string;
    letter: string;
    templates: string;
  };
}

const menuItems: { href: string; labelKey: keyof SidebarClientProps['nav']; icon: string }[] = [
  { href: '/dashboard', labelKey: 'dashboard', icon: '📊' },
  { href: '/modules/document-analyzer', labelKey: 'analyzer', icon: '📄' },
  { href: '/modules/deadline-tracker', labelKey: 'deadline', icon: '⏰' },
  { href: '/modules/checklist', labelKey: 'checklist', icon: '✅' },
  { href: '/modules/letter-generator', labelKey: 'letter', icon: '✍️' },
  { href: '/modules/templates', labelKey: 'templates', icon: '📋' },
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

  if (loading) return <div style={{width:'240px', minHeight:'100vh', background:'linear-gradient(to bottom, #1e3a8a, #312e81)'}} />;
  if (!isAuthenticated) return null;

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-900 to-indigo-900 text-white transition-all duration-300 min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-blue-800 flex items-center justify-between">
        {isOpen && <h2 className="text-xl font-bold">AmtHelper</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-blue-800 rounded-lg transition"
        >
          {isOpen ? '←' : '→'}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={`/${locale}${item.href}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="text-sm">{nav[item.labelKey]}</span>}
          </Link>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-blue-800 flex-shrink-0">
        {isOpen && (
          <div className="mb-4 pb-4 border-b border-blue-800 text-xs">
            <p className="text-blue-200">{user?.email}</p>
            <p className="text-blue-300 font-medium">{user?.role.toUpperCase()}</p>
          </div>
        )}

        {/* Language Switcher - always visible */}
        <div className="mb-3 w-full">
          <div className="text-xs text-blue-300 mb-1">{isOpen ? 'Sprache' : ''}</div>
          <div className="grid grid-cols-4 gap-1 min-w-0">
            {['de', 'ru', 'uk', 'ro'].map((loc) => (
              <button
                key={loc}
                onClick={() => { window.location.href = `/${loc}/dashboard`; }}
                className={`text-xs py-1.5 px-1 rounded transition ${
                  locale === loc ? 'bg-blue-600 text-white' : 'bg-blue-800 text-blue-200 hover:bg-blue-700 hover:text-white'
                }`}
                title={loc.toUpperCase()}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm"
        >
          {isOpen ? 'Abmelden' : '🚪'}
        </button>
      </div>
    </div>
  );
}