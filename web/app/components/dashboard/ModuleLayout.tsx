'use client';

import { SidebarClient } from './SidebarClient';
import { HeaderClient } from './HeaderClient';

interface ModuleLayoutProps {
  children: React.ReactNode;
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
  common: {
    greetingPrefix: string;
    dashboardDefaultTitle: string;
  };
  auth: {
    logout: string;
  };
}

export function ModuleLayout({
  children,
  locale,
  nav,
  common,
  auth,
}: ModuleLayoutProps) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: '240px', flexShrink: 0 }}>
        <SidebarClient locale={locale} nav={nav} />
      </aside>
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <HeaderClient locale={locale} common={common} auth={auth} />
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
