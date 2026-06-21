'use client';

import { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

type Template = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

type CategoryKey =
  | 'finanzamt'
  | 'jobcenter'
  | 'auslaenderbehoerde'
  | 'krankenkasse'
  | 'agentur'
  | 'wohnung'
  | 'rentenversicherung'
  | 'bamf'
  | 'sonstiges';

const TEMPLATES: Template[] = [
  // Finanzamt
  { id: 'widerspruch-steuerbescheid', name: 'Widerspruch gegen Steuerbescheid', description: 'Formeller Einspruch gegen einen Steuerbescheid mit Begründung.', icon: '🧾' },
  { id: 'fristverlaengerung-steuer', name: 'Antrag auf Fristverlängerung', description: 'Antrag auf Verlängerung der Einspruchsfrist.', icon: '📅' },
  { id: 'ratenzahlung-steuer', name: 'Antrag auf Ratenzahlung', description: 'Beantragung einer zinsgünstigen Ratenzahlung.', icon: '💶' },
  { id: 'nachfrage-steuerbescheid', name: 'Nachfrage zum Steuerbescheid', description: 'Höfliche Nachfrage bei unklaren Punkten.', icon: '📨' },
  { id: 'einspruch-vollstreckung', name: 'Einspruch gegen Vollstreckung', description: 'Widerspruch gegen Zwangsvollstreckungsmaßnahmen.', icon: '🛡️' },
  { id: 'stundung-steuer', name: 'Antrag auf Stundung', description: 'Beantragung einer vorübergehenden Zahlungsaussetzung.', icon: '⏸️' },

  // Jobcenter / Bürgergeld
  { id: 'widerspruch-kuerzung', name: 'Widerspruch gegen Kürzung', description: 'Einspruch gegen gekürzte Leistungen.', icon: '✂️' },
  { id: 'weiterzahlung-jobcenter', name: 'Antrag auf Weiterzahlung', description: 'Antrag auf Fortführung der Leistungen.', icon: '🔄' },
  { id: 'nachfrage-jobcenter-bescheid', name: 'Nachfrage zum Bescheid', description: 'Nachfrage zu Details des Leistungsbescheids.', icon: '📨' },
  { id: 'kostenuebernahme-jobcenter', name: 'Antrag auf Kostenübernahme', description: 'Beantragung einer Kostenübernahme.', icon: '🧾' },
  { id: 'beschwerde-sachbearbeiter', name: 'Beschwerde über Sachbearbeiter', description: 'Offizielle Beschwerde über Bearbeitungsvorgang.', icon: '⚠️' },
  { id: 'erhoehung-leistungen', name: 'Antrag auf Erhöhung', description: 'Antrag auf Anpassung oder Erhöhung von Leistungen.', icon: '📈' },
  { id: 'widerspruch-sanktion', name: 'Widerspruch gegen Sanktion', description: 'Einspruch gegen eine Sanktionsmaßnahme.', icon: '🚫' },

  // Ausländerbehörde
  { id: 'verlaengerung-aufenthaltstitel', name: 'Antrag auf Verlängerung Aufenthaltstitel', description: 'Antrag auf Verlängerung des Aufenthaltstitels.', icon: '🛂' },
  { id: 'nachfrage-antragsstatus-auslaender', name: 'Nachfrage zum Antragsstatus', description: 'Anfrage zum Bearbeitungsstand bei der Ausländerbehörde.', icon: '📍' },
  { id: 'niederlassungserlaubnis', name: 'Antrag auf Niederlassungserlaubnis', description: 'Antrag auf dauerhafte Niederlassungserlaubnis.', icon: '🏠' },
  { id: 'widerspruch-ablehnung-aufenthalt', name: 'Widerspruch gegen Ablehnung', description: 'Formeller Widerspruch gegen eine ablehnende Entscheidung.', icon: '🚫' },
  { id: 'familiennachzug', name: 'Antrag auf Familiennachzug', description: 'Antrag auf Nachzug von Familienangehörigen.', icon: '👨‍👩‍👧' },
  { id: 'bearbeitungsstand-anfrage', name: 'Anfrage Bearbeitungsstand', description: 'Anfrage zum aktuellen Bearbeitungsstand des Antrags.', icon: '📨' },

  // Krankenkasse
  { id: 'widerspruch-krankenkasse', name: 'Widerspruch gegen Ablehnung', description: 'Einspruch gegen eine abgelehnte Leistung.', icon: '🏥' },
  { id: 'kostenerstattung-krankenkasse', name: 'Antrag auf Kostenerstattung', description: 'Antrag auf Erstattung von Arzt- oder Medikamentenkosten.', icon: '🧾' },
  { id: 'nachfrage-abrechnung', name: 'Nachfrage zur Abrechnung', description: 'Nachfrage zu einer unklaren Abrechnung.', icon: '📨' },
  { id: 'ausnahmegenehmigung-krankenkasse', name: 'Antrag auf Ausnahmegenehmigung', description: 'Antrag auf eine Heil- oder Kostenausnahme.', icon: '📋' },
  { id: 'beschwerde-krankenkasse', name: 'Beschwerde über Behandlung', description: 'Beschwerde über Service oder Leistungsbearbeitung.', icon: '⚠️' },

  // Bundesagentur für Arbeit
  { id: 'widerspruch-sperrzeit', name: 'Widerspruch gegen Sperrzeitbescheid', description: 'Einspruch gegen eine Sperrzeit bei Arbeitslosengeld.', icon: '🚫' },
  { id: 'verlaengerung-alg', name: 'Antrag auf Verlängerung ALG', description: 'Antrag auf Verlängerung des Arbeitslosengelds.', icon: '📄' },
  { id: 'nachfrage-antrag-arbeitsamt', name: 'Nachfrage zum Antrag', description: 'Anfrage zum Status eines gestellten Antrags.', icon: '📨' },
  { id: 'fahrkostenerstattung-arbeitsamt', name: 'Antrag auf Fahrkostenerstattung', description: 'Beantragung einer Erstattung von Fahrtkosten.', icon: '🚆' },

  // Vermieter / Wohnung
  { id: 'maengelanzeige', name: 'Mängelanzeige', description: 'Offizielle Mängelmeldung an den Vermieter.', icon: '🔧' },
  { id: 'widerspruch-kuendigung', name: 'Widerspruch gegen Kündigung', description: 'Formeller Widerspruch gegen eine Wohnungskündigung.', icon: '🏠' },
  { id: 'mietminderung', name: 'Antrag auf Mietminderung', description: 'Antrag auf vorübergehende Mietminderung.', icon: '💰' },
  { id: 'kaution-zurueckfordern', name: 'Kaution zurückfordern', description: 'Aufforderung zur Rückzahlung der Mietkaution.', icon: '🏦' },
  { id: 'nebenkostenabrechnung-anfechten', name: 'Nebenkostenabrechnung anfechten', description: 'Einspruch gegen eine zu hohe Nebenkostenabrechnung.', icon: '🧾' },

  // Rentenversicherung
  { id: 'nachfrage-rentenbescheid', name: 'Nachfrage zum Rentenbescheid', description: 'Nachfrage zu unklaren Punkten des Rentenbescheids.', icon: '📨' },
  { id: 'kontenklaerung-rente', name: 'Antrag auf Kontenklärung', description: 'Beantragung einer Kontenklärung der Rentenversicherung.', icon: '📋' },
  { id: 'widerspruch-rentenbescheid', name: 'Widerspruch gegen Bescheid', description: 'Einspruch gegen einen Bescheid der Rentenversicherung.', icon: '🚫' },

  // BAMF / Asyl
  { id: 'nachfrage-asylverfahren', name: 'Nachfrage zum Asylverfahren', description: 'Anfrage zum aktuellen Stand des Asylverfahrens.', icon: '📍' },
  { id: 'akteneinsicht-bamf', name: 'Antrag auf Akteneinsicht', description: 'Antrag auf Einsicht in die Verfahrensakte.', icon: '📂' },

  // Sonstiges
  { id: 'kindergeld-widerspruch', name: 'Kindergeld Widerspruch', description: 'Einspruch gegen einen abgelehnten Kindergeldantrag.', icon: '👶' },
  { id: 'gez-befreiung', name: 'GEZ Befreiung Antrag', description: 'Antrag auf Befreiung von Rundfunkbeiträgen.', icon: '📺' },
  { id: 'anmeldung-ummeldung', name: 'Anmeldung Ummeldung', description: 'Offizielle Ummeldung bei der Meldebehörde.', icon: '🏡' },
  { id: 'allgemeine-beschwerde', name: 'Allgemeines Beschwerdeschreiben', description: 'Universelles Beschwerdeschreiben an Behörden.', icon: '📝' },
];

const CATEGORIES: { key: CategoryKey; labelKey: string }[] = [
  { key: 'finanzamt', labelKey: 'finanzamt' },
  { key: 'jobcenter', labelKey: 'jobcenter' },
  { key: 'auslaenderbehoerde', labelKey: 'auslaenderbehoerde' },
  { key: 'krankenkasse', labelKey: 'krankenkasse' },
  { key: 'agentur', labelKey: 'agentur' },
  { key: 'wohnung', labelKey: 'wohnung' },
  { key: 'rentenversicherung', labelKey: 'rentenversicherung' },
  { key: 'bamf', labelKey: 'bamf' },
  { key: 'sonstiges', labelKey: 'sonstiges' },
];

export default function TemplatesPage() {
  const t = useTranslations('modules.templates');
  const router = useRouter();
  const pathname = usePathname();
  const rawLocale = pathname.split('/')[1];
  const locale = (rawLocale || 'de');

  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const translatedTemplates = useMemo(() => {
    let tItems: Record<string, { name: string; description: string }> = {};
    try {
      tItems = t.raw('items') as Record<string, { name: string; description: string }>;
    } catch (e) {
      try {
        tItems = t('items') as any;
      } catch (err) {}
    }
    return TEMPLATES.map((item) => ({
      ...item,
      name: tItems?.[item.id]?.name || item.name,
      description: tItems?.[item.id]?.description || item.description,
    }));
  }, [t]);

  const filteredTemplates = useMemo(() => {
    let list = translatedTemplates;

    if (selectedCategory !== 'all') {
      list = list.filter((item) => {
        const categoryLabel = t(CATEGORIES.find((c) => c.key === selectedCategory)?.labelKey || '');
        return item.name.toLowerCase().includes(categoryLabel.toLowerCase()) || item.id.includes(selectedCategory);
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    return list;
  }, [selectedCategory, searchQuery, t, translatedTemplates]);

  const getCategoryCount = (categoryKey: CategoryKey) => {
    return translatedTemplates.filter((item) => {
      const categoryLabel = t(CATEGORIES.find((c) => c.key === categoryKey)?.labelKey || '');
      return (
        item.name.toLowerCase().includes(categoryLabel.toLowerCase()) ||
        item.id.includes(categoryKey)
      );
    }).length;
  };

  const handleUseTemplate = (template: Template) => {
    router.push(`/${locale}/modules/letter-generator?template=${encodeURIComponent(template.id)}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="page-title">{t('title')}</h1>
        <p className="page-subtitle">{t('subtitle')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="flex-1 px-4 py-3 card-input"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 text-sm font-medium transition ${
            selectedCategory === 'all'
              ? 'btn-primary'
              : 'btn-secondary'
          }`}
        >
          {t('all')} ({translatedTemplates.length})
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
              selectedCategory === category.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t(category.labelKey)} ({getCategoryCount(category.key)})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="card p-5 hover:shadow-md transition"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{template.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{template.name}</h3>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">{template.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleUseTemplate(template)}
              className="w-full px-4 py-2.5 btn-primary"
            >
              {t('use')}
            </button>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          {t('noResults')}
        </div>
      )}
    </div>
  );
}
