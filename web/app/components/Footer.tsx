'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

export function Footer() {
  const locale = useLocale();

  return (
    <footer className="bg-gray-100 border-t mt-12 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <h4 className="font-bold mb-3">Rechtlich</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/datenschutz`} className="hover:underline">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/impressum`} className="hover:underline">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Produkt</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/pricing`} className="hover:underline">
                  Preise
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@amthelper.de" className="hover:underline">
                  support@amthelper.de
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Social</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 text-center text-sm text-gray-600">
          <p>&copy; 2026 AmtHelper GmbH. Alle Rechte vorbehalten.</p>
          <p className="mt-2 text-xs">
            DSGVO-konform • Sicherheit gewährleistet • Made in Germany
          </p>
        </div>
      </div>
    </footer>
  );
}
