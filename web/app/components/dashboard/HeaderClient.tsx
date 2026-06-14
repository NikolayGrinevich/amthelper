'use client';

import { useAuth } from '@/app/providers/AuthProvider';

interface HeaderClientProps {
  locale: string;
  common: {
    greetingPrefix: string;
    dashboardDefaultTitle: string;
  };
  auth: {
    logout: string;
  };
}

export function HeaderClient({ locale, common, auth }: HeaderClientProps) {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">
        {user?.full_name
          ? `${common.greetingPrefix} ${user.full_name}!`
          : common.dashboardDefaultTitle}
      </h1>
      <div className="text-sm text-gray-600">
        {user?.subscription_status === 'active' ? (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
            {user?.role.toUpperCase()} ✓
          </span>
        ) : (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
            FREE
          </span>
        )}
      </div>
    </div>
  );
}