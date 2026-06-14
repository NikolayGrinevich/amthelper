'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const params = useParams();
  const locale = params.locale as string || 'de';

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push(`/${locale}/dashboard`);
      } else {
        router.push(`/${locale}/auth/signin`);
      }
    }
  }, [isAuthenticated, loading, router, locale]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Загрузка...</p>
      </div>
    </div>
  );
}
