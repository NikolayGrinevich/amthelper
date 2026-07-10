'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { locales, localeNames, type Locale } from '@/i18n.config';

const localeFlags: Record<Locale, string> = {
  de: '🇩🇪',
  ru: '🇷🇺',
  uk: '🇺🇦',
  ro: '🇷🇴',
  tr: '🇹🇷',
};

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export function LanguageSwitcher({ variant = 'light', className = '' }: LanguageSwitcherProps) {
  const currentLocale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }
    // Use window.location for full page navigation (works reliably across all browsers)
    // pathname from next/navigation may NOT include locale prefix when using next-intl middleware
    const fullPath = window.location.pathname;
    const segments = fullPath.split('/');
    if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
      const newPath = segments.join('/') || `/${newLocale}`;
      setIsOpen(false);
      // Use setTimeout to ensure state update completes before navigation
      setTimeout(() => { window.location.href = newPath; }, 0);
    } else {
      setIsOpen(false);
      setTimeout(() => { window.location.href = `/${newLocale}`; }, 0);
    }
  };

  const isDark = variant === 'dark';
  const textColor = isDark ? 'text-white' : 'text-gray-700';
  const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100';
  const borderClass = isDark ? 'border-white/20' : 'border-gray-200';

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition text-sm font-medium ${textColor} ${hoverBg} border ${borderClass}`}
        aria-label="Language switcher"
      >
        <span className="text-lg">{localeFlags[currentLocale as Locale]}</span>
        <span className="hidden sm:inline">{localeNames[currentLocale as Locale]}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 left-0 sm:left-auto sm:right-0 sm:min-w-[180px] bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                loc === currentLocale
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{localeFlags[loc]}</span>
              <span>{localeNames[loc]}</span>
              {loc === currentLocale && (
                <svg className="w-4 h-4 ml-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}