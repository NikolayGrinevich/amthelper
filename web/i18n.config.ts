export const locales = ['de', 'ru', 'uk', 'ro'] as const;
export const defaultLocale = 'de' as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  de: 'Deutsch',
  ru: 'Русский',
  uk: 'Українська',
  ro: 'Română',
};
