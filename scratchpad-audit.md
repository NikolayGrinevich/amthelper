# AmtHelper — статус after audit / build restore
Дата: 12.06.2026

## Что сделано
- `next.config.ts` → `next.config.mjs` (plain JS)
- React 19 → 18.3.1
- `next build` восстановлен
- Mobile изолирован через webpack externals + watch ignore
- TypeScript/ESLint проверки отключены временно

## Открытые риски
- Два web-стэка: root (`app/`) + `web/` (`app/[locale]/`) — неизвестно, какой продакшн
- Stripe webhook пишет в `subscriptions`, схема описывает `user_subscriptions`
- Anthropic вызывается напрямую из роутов, нет retry/fallback/budget
- Дубли Anthropic-клиентов: `lib/anthropic.ts` и `lib/anthropic-service.ts`
- Линтинг/типы отключены в билде
- Нет тестов/CI
- Ключи не сброшены после утечки; `.env.local` не достоверна

## Следующий шаг
- Выбрать канонический web-стек и уничтожить дубль
- Свести таблицы Stripe к единому имени
- Вернуть ESLint/TS и фиксить по одному
- Добавить smoke-тест
