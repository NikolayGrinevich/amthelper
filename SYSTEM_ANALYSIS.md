# 🔍 ПОЛНЫЙ АНАЛИЗ СИСТЕМЫ AmtHelper

**Дата анализа:** 09.06.2026  
**Статус:** PRE-PRODUCTION (Week 1 Prep)  
**Проект:** C:\HERMES\projects\amthelper\

---

## 📊 АРХИТЕКТУРА

**Тип:** Distributed SaaS (Web + Mobile)

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Клиенты)                     │
├──────────────────────┬──────────────────────────────────┤
│  Web: Next.js 15.x   │   Mobile: React Native / Expo    │
│  React 19 + TS       │   TypeScript + NativeWind        │
│  shadcn/ui + Tailwind│   expo-camera, push notifs       │
└──────────────────────┴──────────────────────────────────┘
         ↓                              ↓
┌─────────────────────────────────────────────────────────┐
│               BACKEND (Serverless API Layer)              │
├──────────────────────────────────────────────────────────┤
│  Vercel Functions (Node.js)                              │
│  • /api/analyze-document (Claude Vision)                 │
│  • /api/generate-letter (Claude Text)                    │
│  • /api/webhooks/stripe (Subscription sync)              │
│  • /api/reminders (Cron job trigger)                     │
└──────────────────────────────────────────────────────────┘
         ↓                ↓               ↓
   ┌─────────┐    ┌────────────┐  ┌───────────────┐
   │ Supabase│    │  Anthropic │  │  Stripe       │
   │ (Auth,  │    │  Claude    │  │  (Payments)   │
   │ PostgreSQL)  │  (AI)      │  │               │
   └─────────┘    └────────────┘  └───────────────┘
   
   Supabase Storage (documents/)
   Resend (email service)
```

---

## 🔧 TECH STACK (ФИНАЛЬНЫЙ)

### **WEB FRONTEND**
```
Next.js 15.1.x
├── React 19
├── TypeScript 5.x
├── Tailwind CSS 4 + shadcn/ui
├── next-i18next (DE/RU/UK/EN)
├── React Hook Form (validation)
├── Framer Motion (animations)
└── @supabase/supabase-js (API client)
```

### **MOBILE FRONTEND**
```
React Native (Expo)
├── TypeScript
├── NativeWind (Tailwind for RN)
├── React Navigation (Tab + Stack)
├── i18n-js (shared translations)
├── expo-camera (document scanning)
├── expo-notifications (deadline alerts)
├── @supabase/supabase-js (shared backend)
└── EAS (Expo Application Services)
```

### **BACKEND (Serverless)**
```
Vercel Functions (Node.js 20)
├── @anthropic-ai/sdk ^0.102.0 (Claude API)
├── @supabase/supabase-js (Database)
├── stripe ^22.2.0 (Payment)
├── resend (Email)
├── node-cron (scheduled tasks)
└── TypeScript + async/await
```

### **DATABASE**
```
PostgreSQL 15 (Supabase)
├── Row-Level Security (RLS) enabled
├── Tables: users, documents, letters, templates, reminders, subscriptions, usage_tracking
├── Backups: Daily snapshots + Point-in-time recovery
└── Monitoring: Supabase dashboard + Sentry
```

### **INFRASTRUCTURE**
```
Vercel (Web)
├── Auto-deploy from GitHub (feature branch → main)
├── Serverless Functions (/api/*)
├── Environment secrets (API keys, DB credentials)
└── Analytics + error tracking

EAS (Mobile)
├── Managed builds (iOS + Android)
├── TestFlight submission (iOS)
├── Google Play manual submission (week 8+)
└── OTA updates via EAS Updates
```

---

## ✨ ОСНОВНЫЕ ФУНКЦИИ (5 Core Features)

### **1️⃣ DOCUMENT ANALYZER**

**Назначение:** Анализ немецких писем от государственных учреждений

| Параметр | Описание |
|----------|---------|
| **Вход** | PDF/JPG/PNG (макс 10MB) |
| **Обработка** | Claude Vision API + OCR |
| **Выход** | Тип документа, отправитель, дата, сроки, резюме (на языке пользователя) |
| **Время** | 2-5 секунд |
| **Стоимость** | ~€0.002-0.005 на документ |
| **Output Format** | JSON: `{ type, sender, date, deadline, summary, urgency }` |

**Примеры типов документов:**
- Finanzamt (налоговая служба)
- Ausländerbehörde (миграционная служба)
- Sozialbehörde (социальное обеспечение)
- Versicherung (страховая компания)

---

### **2️⃣ DEADLINE TRACKER**

**Назначение:** Автоматические напоминания о сроках ответов

| Параметр | Описание |
|----------|---------|
| **Источник** | Извлекаются из анализа документа |
| **Напоминания** | 7, 3, 1 день до срока + в день срока |
| **Каналы** | Email (Resend), Push (мобайл), SMS (v1.1) |
| **Backend** | Supabase pg_cron + Vercel Functions |
| **Персистентность** | reminders table в БД |

**Workflow:**
```
Document uploaded → Analyzer extracts deadline → 
Reminder created in DB → pg_cron triggers at scheduled time → 
Vercel Function sends email/push → User receives notification
```

---

### **3️⃣ DOCUMENT CHECKLIST**

**Назначение:** Интерактивный чеклист необходимых документов по типу письма

| Параметр | Описание |
|----------|---------|
| **Генерация** | Автоматическая по типу документа |
| **Размер** | 15-20 пунктов на чеклист |
| **Persistence** | Сохраняется в Supabase |
| **UI** | Interactive checkboxes (web + mobile) |
| **Export** | PDF download |

**Примеры:**
```
Finanzamt Complaint:
  ☐ Копия исходного решения (Bezugsdokument)
  ☐ Номер дела (Aktenzeichen)
  ☐ Обоснование жалобы (Begründung der Beschwerde)
  ☐ Доказательства (Belege/Dokumentation)
  ☐ Подпись (Unterschrift)
  
Tax Appeal (Einspruch):
  ☐ Налоговый номер (Steuernummer)
  ☐ Год налогообложения (Veranlagungsjahr)
  ☐ Причины возражения (Gründe des Einspruchs)
  ☐ Финансовые документы (Finanzdokumente)
  ☐ Предложенная корректировка (Vorgeschlagene Korrektur)
```

---

### **4️⃣ LETTER GENERATOR (ГЛАВНАЯ ФИЧА 🔥)**

**Назначение:** AI генерирует формальные ответные письма на немецком

| Параметр | Описание |
|----------|---------|
| **Вход** | Тип документа + объяснение пользователя (400-1000 chars) |
| **Обработка** | Claude 3.5 Sonnet (text generation) |
| **Выход** | Формальное письмо на немецком (200-500 слов, Sie) |
| **Время** | 3-8 секунд |
| **Стоимость** | ~€0.01-0.02 за генерацию |
| **AI Model** | claude-3-5-sonnet-20241022 |

**Workflow:**
```
User input: "Die Finanzamt wünscht mehr Dokumentation"
     ↓
Claude System Prompt (German legal letter template)
     ↓
Generated Letter (formal, professional, compliant with law)
     ↓
User Actions:
  ✏️  Edit (inline editor)
  🔄 Regenerate (new version)
  👍 Use This (confirm)
  📄 Export PDF
  ✉️  Send via Email (Resend)
  🔗 Get Shareable Link
```

**Выход (Example):**
```
Sehr geehrte Damen und Herren,

vielen Dank für Ihr Schreiben vom 15.06.2026. Ich möchte 
Ihnen hiermit die folgenden zusätzlichen Unterlagen zur Verfügung 
stellen, um Ihre Anfrage vollständig zu beantworten...

[Generated body by Claude, tailored to document type]

Mit freundlichen Grüßen,
[User Name]
```

---

### **5️⃣ PRE-MADE TEMPLATES (5 шаблонов)**

**Назначение:** Готовые примеры писем на немецком (для быстрого старта)

| № | Название | Использование | Сложность |
|----|----------|---|---|
| 1 | **Beschwerde gegen Finanzamt** | Жалоба на решение налоговой | Medium |
| 2 | **Einspruch gegen Steuerbescheid** | Возражение на налоговый расчёт | Hard |
| 3 | **Anfrage Steuernummer** | Запрос налогового номера | Easy |
| 4 | **Bescheinigung Gewinnermittlung** | Подтверждение расчётов дохода | Medium |
| 5 | **Widerspruch falsche Besteuerung** | Возражение против неправильного налогообложения | Hard |

**Usage Pattern:**
```
User selects template → Template UI shows preview → 
"Use Template" → Pre-fills Letter Generator → 
Claude refines based on template + user input
```

---

## 🗄️ БАЗА ДАННЫХ (PostgreSQL 15)

### **users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  language_preference TEXT DEFAULT 'DE' -- DE/RU/UK/EN
  subscription_tier TEXT DEFAULT 'free', -- free/pro
  stripe_customer_id TEXT NULLABLE,
  updated_at TIMESTAMP DEFAULT now()
);
-- RLS: Users can only read/write their own row
```

### **documents**
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,  -- Supabase Storage path
  file_name TEXT NOT NULL,
  upload_date TIMESTAMP DEFAULT now(),
  analyzed_data JSONB,  -- { type, sender, date, deadline, summary, urgency }
  document_type TEXT,  -- finanzamt, ausländerbehörde, etc.
  extracted_deadline DATE NULLABLE,
  sender TEXT,
  summary TEXT,  -- in user's language
  deleted_at TIMESTAMP NULLABLE  -- soft delete
);
-- RLS: Users can only access their own documents
-- Indexes: user_id, document_type, extracted_deadline
```

### **letters**
```sql
CREATE TABLE letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_id UUID NULLABLE REFERENCES documents(id),
  template_id UUID NULLABLE REFERENCES templates(id),
  generated_text TEXT NOT NULL,  -- Original Claude output
  edited_text TEXT NULLABLE,  -- User modifications
  created_at TIMESTAMP DEFAULT now(),
  regeneration_count INT DEFAULT 0,
  exported_as_pdf BOOL DEFAULT false,
  sent_date TIMESTAMP NULLABLE,
  ai_generation_cost FLOAT DEFAULT 0.0
);
-- RLS: Users can only access their own letters
```

### **templates**
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,  -- beschwerde_finanzamt
  title TEXT NOT NULL,
  description TEXT,  -- markdown
  content_de TEXT NOT NULL,  -- German template text
  tone TEXT,  -- professional, assertive, etc.
  difficulty TEXT,  -- easy, medium, hard
  category TEXT,  -- tax, authorities, etc.
  created_at TIMESTAMP DEFAULT now()
);
-- RLS: Public read (no write except admin)
```

### **reminders**
```sql
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id),
  deadline DATE NOT NULL,
  reminder_type TEXT,  -- seven_days, three_days, one_day, deadline
  scheduled_for TIMESTAMP NOT NULL,
  sent_at TIMESTAMP NULLABLE,
  notification_channel TEXT,  -- email, push, sms
  status TEXT DEFAULT 'pending'  -- pending, sent, failed
);
-- RLS: Users can only read their own reminders
-- Indexes: user_id, scheduled_for, status
```

### **subscriptions**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  current_tier TEXT,  -- free, pro
  status TEXT,  -- active, cancelled, past_due
  started_at TIMESTAMP,
  ended_at TIMESTAMP NULLABLE,
  auto_renew BOOL DEFAULT true
);
-- RLS: Users can only read/write their own subscription
```

### **usage_tracking**
```sql
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  month TEXT,  -- YYYY-MM
  documents_analyzed INT DEFAULT 0,
  letters_generated INT DEFAULT 0,
  api_calls_total INT DEFAULT 0,
  ai_cost_total FLOAT DEFAULT 0.0,
  storage_used_mb FLOAT DEFAULT 0.0
);
-- RLS: Users read own, Vercel Functions write
-- Indexes: user_id, month
```

---

## 🔗 ИНТЕГРАЦИИ

### **Anthropic Claude API**

```typescript
// Document Analysis
POST /api/analyze-document
Body: { file_base64, file_type }
Response: { 
  type: string,
  sender: string,
  date: string,
  deadline: string,
  summary: string,
  urgency: 'low' | 'medium' | 'high'
}
Cost: ~€0.002-0.005 per request
Model: claude-3-5-sonnet-20241022

// Letter Generation
POST /api/generate-letter
Body: { document_type, user_input, language }
Response: { 
  letter_draft: string,
  regeneration_available: boolean
}
Cost: ~€0.01-0.02 per request
Model: claude-3-5-sonnet-20241022
```

**Rate Limit:** 100 requests/minute (upgradeable)  
**Estimated Cost:** €500-1000/месяц для 1000 active users

---

### **Stripe Webhooks**

```
Events handled:
1. customer.subscription.created
   → Webhook: Mark user as Pro in subscriptions table
   → Update users.subscription_tier = 'pro'

2. customer.subscription.deleted
   → Webhook: Downgrade user to Free
   → Update users.subscription_tier = 'free'

3. invoice.payment_failed
   → Webhook: Send alert email via Resend
   → Mark subscription.status = 'past_due'

4. charge.refunded
   → Webhook: Process refund logic (future)

Webhook Endpoint: /api/webhooks/stripe
Verification: HMAC signature check (Stripe secret key)
Retry: Automatic retries on 5xx errors
```

---

### **Resend Email Service**

```typescript
// Deadline Reminder (7 days before)
resend.emails.send({
  from: 'noreply@amthelper.de',
  to: user.email,
  subject: 'Erinnerung: Antwortzeitrahmen läuft ab',
  html: `<p>Sehr geehrter ${user.name},</p>
         <p>Das Fälligkeitsdatum für Ihr Dokument rückt näher...</p>`,
  reply_to: 'support@amthelper.de'
})

// Payment Failure Alert
// Letter Delivery (when user exports)
```

**Limits:** 100/day free, unlimited on paid  
**Cost:** €30-100/месяц

---

### **Vercel Functions (API Routes)**

```
GET  /api/documents          → List user documents
POST /api/documents          → Upload new document
GET  /api/documents/[id]     → Get document details
POST /api/analyze-document   → Trigger Claude analysis
POST /api/generate-letter    → Generate response letter
POST /api/webhooks/stripe    → Stripe webhook handler
GET  /api/reminders/[month]  → Get user reminders
POST /api/export-pdf         → Export letter as PDF
```

---

## 💰 ФИНАНСОВЫЙ АНАЛИЗ

### **ДОХОДЫ (Monetization)**

| Tier | Цена | Особенности | Целевая конверсия |
|------|------|-----------|------------------|
| **Free** | €0 | 5 docs/месяц, анализ only | 90% (базовые пользователи) |
| **Pro** | €4.99/месяц | Unlimited, всё включено | 10% (платящие) |
| **Business** | €14.99/месяц (v2.0) | Team, analytics, API | После 100 Pro |

### **РАСХОДЫ (Fixed Monthly)**

| Статья | Минимум | Максимум | Примечание |
|--------|---------|---------|-----------|
| Claude API | €500 | €1000 | Scales with usage |
| Supabase Pro | €60 | €60 | Database + auth |
| Vercel | €20 | €100 | Serverless functions |
| Resend | €30 | €100 | Email delivery |
| Domain | €1 | €1 | amthelper.de (€10/год) |
| **ИТОГО** | **€611** | **€1261** | Per month |

### **ТОЧКА БЕЗУБЫТОЧНОСТИ**

| Период | Pro Users | Доход | Расходы | Net |
|--------|----------|-------|---------|-----|
| Месяц 1 | 10 | €49.90 | €900 | -€850 |
| Месяц 3 | 50 | €249.50 | €900 | -€650 |
| Месяц 6 | 100 | €499 | €900 | -€401 |
| Месяц 9 | 200 | €998 | €900 | +€98 ✅ |
| Месяц 12 | 400 | €1996 | €900 | +€1096 ✅ |

**Year 1 Projection:** €12-15k net revenue (консервативно, 25% conversion in month 12)

---

## ⚠️ РИСКИ И МИTIGATIONS

### **ТЕХНИЧЕСКИЕ РИСКИ**

| Риск | Impact | Mitigation |
|------|--------|-----------|
| Claude API outage | Users can't analyze/generate | Implement caching, fallback templates |
| Stripe webhook delays | Subscription sync fails | Retry logic, manual reconciliation dashboard |
| Database corruption | Total data loss | Daily backups, point-in-time recovery, test restores |
| Mobile app rejection | 2-week delay, need fixes | Early submission week 7, legal review |
| Memory leaks in mobile app | App crashes | Proper cleanup (useEffect), memory profiling |

### **БИЗНЕС РИСКИ**

| Риск | Impact | Mitigation |
|------|--------|-----------|
| Low user acquisition (< 50/month) | No revenue | Target Russian communities (Reddit, Telegram) |
| Low Pro conversion (< 5%) | Not sustainable | A/B test pricing, improve onboarding |
| Legal challenges (DSGVO) | App takedown | Legal review week 3, templates verification |
| Competitor launches | Market share loss | Network effects, templates, integrations |

### **ОПЕРАЦИОННЫЕ РИСКИ**

| Риск | Impact | Mitigation |
|------|--------|-----------|
| Developer burnout | Quality drops, timeline slips | Delegate UI to Claude Code, focus on backend |
| Scope creep | MVP delayed | Strict feature freeze week 4, v1.1 backlog |

---

## 📅 TIMELINE (9 НЕДЕЛЬ)

```
НЕДЕЛЯ 1-2:   Инфра + многоязычность (DE/RU/UK/EN) + мобайл skeleton
              ├── GitHub + CI/CD
              ├── Supabase setup
              ├── Vercel deploy (test)
              ├── next-i18next + translation files
              ├── Expo project + navigation
              └── API integration stubs

НЕДЕЛЯ 3-4:   Основные фичи (параллельно web + mobile)
              ├── Document Analyzer (Claude Vision)
              ├── Deadline Tracker (calendar, reminders)
              ├── Document Checklist (interactive)
              ├── Letter Generator (ГЛАВНАЯ ФИЧА)
              ├── Design system polish
              └── Mobile screens (same features)

НЕДЕЛЯ 5:     Stripe monetization
              ├── Vercel deployment LIVE (production URL)
              ├── Stripe webhook endpoint
              ├── Webhook testing + verification
              ├── Rate limiting (Free 5/mo, Pro unlimited)
              └── Paywall UI

НЕДЕЛЯ 6:     5 шаблонов + polish
              ├── Create 5 German templates
              ├── Template selection UI
              ├── Error boundaries + fallback UI
              ├── Toast notifications
              ├── Keyboard shortcuts
              └── Animation refinements

НЕДЕЛЯ 7-8:   QA + security + app store prep
              ├── Manual testing (all features)
              ├── Security audit (RLS, CSRF, API keys)
              ├── Performance optimization
              ├── Mobile device testing (iOS + Android)
              ├── EAS build configuration
              ├── Monitoring setup (Sentry, Vercel Analytics)
              ├── Support page + FAQ
              └── Store listing prep

НЕДЕЛЯ 9:     GO LIVE (web + mobile одновременно)
              ├── Stripe live mode
              ├── Final deployment
              ├── EAS builds (iOS + Android)
              ├── App Store + Play Store submit
              ├── Launch announcement
              ├── Metrics collection (signups, conversion)
              └── Early user feedback & bug fixes
```

---

## 📈 ROADMAP (12 МЕСЯЦЕВ)

### **v1.0 (Week 9, August 2026)**
- ✅ Document Analyzer
- ✅ Deadline Tracker (email reminders)
- ✅ Document Checklist
- ✅ Letter Generator
- ✅ 5 Pre-made Templates
- ✅ Free/Pro tiers
- ✅ DE/RU/UK/EN languages
- ✅ Web + Mobile platforms

### **v1.1 (Month 4, November 2026)**
- 🔜 SMS reminders (Twilio integration)
- 🔜 Telegram bot for quick uploads
- 🔜 20+ templates (expanded from 5)
- 🔜 Export history as CSV/Excel
- 🔜 Mobile offline mode + sync

### **v2.0 (Month 12, June 2027)**
**Requirement:** 100+ Pro users minimum
- 🔜 Business tier (€14.99/month, team management)
- 🔜 Developer API (webhooks, integrations)
- 🔜 Lawyer review integration (proofreading service)
- 🔜 Automatic letter sending (API integration)
- 🔜 Advanced analytics (processing time, success rates)

---

## ✨ ИТОГОВАЯ ОЦЕНКА

| Аспект | Статус | Заметка |
|--------|--------|---------|
| **Архитектура** | ✅ Solid | Scalable, serverless, modern |
| **Tech Stack** | ✅ Proven | All established technologies |
| **MVP Scope** | ✅ Realistic | 9 weeks, web + mobile parallel |
| **Monetization** | ✅ Clear | Free/Pro tiers, €4.99/mo target |
| **Market** | ✅ Validated | 500k Russian speakers in Germany, no competitors |
| **Risks** | ⚠️ Medium | Mainly business (acquisition, churn) |
| **Team** | ⚠️ Solo | Single developer (souchastnik), potential burnout |
| **Timeline** | ⚠️ Tight | 9 weeks for 2 platforms, no slack |

---

## 🎯 КЛЮЧЕВЫЕ УСПЕШНЫЕ ФАКТОРЫ

1. **Правильный рынок:** 500k русскоязычных в Германии, никаких конкурентов
2. **Понятное value prop:** €4.99 vs €50-150 консультанту
3. **Готовый стек:** Next.js + React Native + Supabase — всё работает вместе
4. **AI-first:** Claude делает 90% work (анализ + письма)
5. **Параллельная разработка:** Web + Mobile одновременно → быстрее в market

---

**Анализ завершён. Готов к неделе 1?** 🚀
