import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n.config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false,
});

const PROTECTED_ROUTES = [
  '/dashboard',
  '/modules/document-analyzer',
  '/modules/letter-generator',
  '/modules/deadline-tracker',
  '/modules/checklist',
  '/modules/templates',
];

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  if (response.headers.get('location')) {
    return response;
  }

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.includes(route));
  const authToken = request.cookies.get('auth_token')?.value;

  if (isProtected && !authToken) {
    const locale = pathname.split('/')[1] || defaultLocale;
    const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: ['/', '/(de|ru|uk|ro)/:path*'],
};
