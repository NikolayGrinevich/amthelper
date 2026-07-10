'use client';

import { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/app/providers/AuthProvider';
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher';
import { GoogleSignInButton } from '@/app/components/GoogleSignInButton';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const { login } = useAuth();
  const t = useTranslations('auth');

  const locale = useMemo(() => pathname.split('/')[1] || 'de', [pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher variant="light" />
      </div>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📄</div>
          <h1 className="text-3xl font-bold text-gray-900">AmtHelper</h1>
          <p className="text-gray-600 text-sm mt-2">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ❌ {error}
            </div>
          )}

          <div className="text-right">
            <Link href={`/${locale}/auth/forgot-password`} className="text-sm text-blue-600 hover:underline">
              {t('forgotPassword')}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition mt-6"
          >
            {loading ? t('signingIn') : t('signInButton')}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-400">oder</span>
            </div>
          </div>
          <div className="mt-4">
            <GoogleSignInButton mode="signin" />
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            {t('noAccount')}{' '}
            <Link href={`/${locale}/auth/signup`} className="text-blue-600 hover:underline font-semibold">
              {t('signUpLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
