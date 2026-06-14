import { getRequestConfig } from 'next-intl/server';

const locales = ['de', 'ru', 'uk', 'ro'] as const;

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !locales.includes(locale as any)) {
    return {
      locale: 'de',
      messages: (await import('@/messages/de/common.json')).default,
    } as any;
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}/common.json`)).default,
  };
});
