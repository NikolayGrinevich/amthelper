# i18n Аудит AmtHelper — 21.06.2026

## 1. Сравнение ключей между локалями

Всего ключей: 233 (уникальных)

### 1.1 Checklist — RO расходится с DE/RU/UK

**DE/RU/UK ключи** (используются компонентом):
`title, subtitle, no_checklists, no_documents, loading, completed, reset, overall_progress, items_done, all_done, no_required_docs`

**RO ключи** (не используются компонентом):
`title, add_checklist, cancel, checklist_name, checklist_name_placeholder, description, description_placeholder, items, item_placeholder, add_after, create, no_checklists, completed`

**Проблема**: RO имеет CRUD-ключи (add, cancel, description), компонент использует display-ключи (all_done, items_done, overall_progress). RO users увидят ключи вместо перевода.

### 1.2 DeadlineTracker — RO расходится с DE/RU/UK

**DE/RU/UK ключи** (используются компонентом):
`title, subtitle, no_deadlines, no_documents, loading, days_left, days_left_one, days_overdue, overdue, no_deadline, create_letter, urgency_critical, urgency_high, urgency_ok`

**RO ключи** (не используются компонентом):
`title, add_deadline, cancel, title_placeholder, description, description_placeholder, due_date, priority, low, medium, high, add, no_deadlines, days_left, days_overdue`

**Проблема**: Аналогично checklist — RO имеет form-ключи, компонент использует display-ключи.

### 1.3 Templates — отсутствуют общие ключи

DE/RU/UK не имеют:
- `modules.templates.all` (используется как "Alle")
- `modules.templates.searchPlaceholder` (placeholder поиска)
- `modules.templates.subtitle` (подзаголовок)
- `modules.templates.noResults` (нет результатов)
- `modules.templates.finanzamt, jobcenter, ...` (9 категорий)

RO имеет все категории, но не имеет `noResults`.

### 1.4 Missing `noResults` — все 4 локали

Ключ `modules.templates.noResults` отсутствует во всех локалях. При пустом результате поиска — пустая страница.

## 2. Hardcoded строки

| Файл | Строка |
|------|--------|
| auth/signin/page.tsx:49 | `placeholder="you@example.com"` |
| auth/signin/page.tsx:61 | `placeholder="••••••••"` |
| auth/signup/page.tsx:57 | `placeholder="John Doe"` |
| auth/signup/page.tsx:69 | `placeholder="you@example.com"` |
| auth/signup/page.tsx:81 | `placeholder="••••••••"` |
| auth/signup/page.tsx:93 | `placeholder="••••••••"` |
| document-analyzer/page.tsx:276 | `aria-label="Upload document"` |
| document-analyzer/page.tsx:323 | `aria-label="Remove photo"` |

## 3. Все страницы — HTTP 200

28 страниц (4 локали × 7 модулей) — все 200 OK.

## 4. Шаблоны (40 шт)

Все 42 шаблона присутствуют во всех 4 локалях. DE/RU/UK не имеют ключей категорий (finanzamt, jobcenter, etc.) — страница показывает key name вместо перевода.

## 5. Фиксы выполнены (21.06.2026)

✅ RO checklist/deadlineTracker — синхронизированы с DE структурой
✅ DE/RU/UK templates — добавлены `all, searchPlaceholder, subtitle, noResults`, 9 категорий
✅ RO — добавлены 8 пропущенных ключей
✅ Все 213 ключей синхронизированы по всем 4 локалям
✅ Portal route создан
✅ Cancel button починен
✅ Hardcoded "Template" → `t('templates')`

## 6. 🚨 КРИТИЧЕСКАЯ ПРОБЛЕМА: Webhook не обновляет tier

**Статус**: ❌ Webhook Stripe НЕ обновляет `users.tier`

**Данные из Supabase REST API**:
```json
users[0].tier = "free"        ← НЕ "pro"!
users[0].stripe_customer_id = null  ← НЕ установлен!
```

**Корневая причина**: Webhook handler (`webhooks/stripe/route.ts`) обрабатывает только:
- `customer.subscription.created` → запись в `user_subscriptions`
- `customer.subscription.updated` → запись в `user_subscriptions`
- `customer.subscription.deleted` → обновление статуса

**НЕТ обработки**:
1. ❌ `checkout.session.completed` — не ловится вообще
2. ❌ Обновление `users.tier = 'pro'` — нигде не выполняется
3. ❌ `users.stripe_customer_id` — остаётся `null` для demo-пользователя

**Почему auth/me показывает pro**: `/api/auth/me` хардкодит `"role": "pro"` для demo-токена (строка с `demo_token_`), не читая из БД.

**Фикс**: Добавить в webhook handler:
1. Обработку `checkout.session.completed`
2. UPDATE `users SET tier='pro', stripe_customer_id = ... WHERE id = ...`

| # | Фикс | Impact | Сложность |
|---|------|--------|-----------|
| 1 | RO checklist/deadlineTracker — синхронизировать с DE | RO users видят ключи | HIGH |
| 2 | DE/RU/UK templates: добавить `all, searchPlaceholder, subtitle` | Фильтрация и UX | LOW |
| 3 | Все 4 локали: добавить `noResults` | Пустой результат поиска | LOW |
| 4 | Auth placeholders → i18n | Косметика | LOW |
| 5 | Analyzer aria-labels → i18n | Accessibility | LOW |
