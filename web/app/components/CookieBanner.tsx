'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    // Check if user already consented
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
    // Enable analytics here if applicable
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 md:p-6 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">🍪 Datenschutz & Cookies</h3>
            <p className="text-sm text-gray-300">
              Wir verwenden Cookies für die Authentifizierung und Sitzungsverwaltung. 
              Mit Ihrer Zustimmung nutzen wir auch Analytics, um AmtHelper zu verbessern.
              {' '}
              <Link href="/datenschutz" className="underline hover:text-blue-300">
                Datenschutzerklärung lesen
              </Link>
            </p>
          </div>
          <div className="flex gap-2 whitespace-nowrap">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded transition"
            >
              Ablehnen
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded transition font-medium"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
