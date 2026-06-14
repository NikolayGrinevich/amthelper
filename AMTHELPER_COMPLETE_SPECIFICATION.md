# 🔥 AmtHelper — ПОЛНАЯ СПЕЦИФИКАЦИЯ ПРОЕКТА

**Документ создан:** 9 июня 2026  
**Версия:** 1.0  
**Статус:** APPROVED & READY FOR DEVELOPMENT  

---

## 📋 ОБЗОР

**AmtHelper** — премиум SaaS приложение для русскоязычных и других мигрантов в Германии, которые борются с немецкой бюрократией.

- **Проблема:** Письма от Finanzamt, Ausländerbehörde и т.д. на немецком, непонимание, боязнь ошибиться
- **Решение:** Анализирует письмо за 30 сек, объясняет, создаёт дедлайн, список документов, генерирует готовый ответ на немецком
- **Результат:** €4.99/месяц вместо €50-150 консультанту

---

## 🎯 ОСНОВНЫЕ ХАРАКТЕРИСТИКИ

### ЯЗЫКИ
```
🔴 ЗАПУСК (Неделя 1-4):
  • Русский (РУ) — основной рынок
  • Украинский (UK) — 150k потребителей
  • Английский (EN) — expats стандарт
  • Немецкий (DE) — контекст

🟡 МЕСЯЦ 2-3 (по спросу):
  • Польский (PL), Турецкий (TR), Арабский (AR), Болгарский (BG)

🟢 МЕСЯЦ 4+ (по аналитике):
  • Испанский, Португальский, Итальянский, Вьетнамский и т.д.
```

### MONETIZATION
```
🆓 FREE: 5 писем/месяц, без генерации, с рекламой
💎 PRO: €4.99/месяц, unlimited, full features, без рекламы
🏢 BUSINESS: €14.99/месяц, team management, analytics, webhooks
🔧 DEVELOPER API: custom pricing (€100-5000/месяц)

ПРОГНОЗ (месяц 3): €10,000+/месяц = €120,000/год
```

### ДИЗАЙН
```
🎨 Premium UI (не "тупой чат"), dark mode, smooth animations
🎯 Figma Design System: Montserrat+Inter, индиго #6366F1
📱 Responsive на всех экранах, доступность
🔧 Shadcn/UI (веб) + NativeWind (мобила)
```

### ГЛАВНЫЕ ФИЧИ
```
1️⃣ Letter Analysis Engine (OCR → Claude → результат)
2️⃣ Deadline Tracker (extract dates, email/SMS/push reminders)
3️⃣ Document Checklist (автоматом список документов)
4️⃣ Response Letter Generation (🤖 AI пишет на немецком, не выбор шаблонов!)
5️⃣ Business Dashboard (фирма видит кто работает, экономит €1400+/месяц)
6️⃣ Developer API (для интеграции, custom webhooks)
```

---

## 🛠️ TECH STACK

**Frontend (Веб):**
- Next.js 14, TypeScript, Tailwind, Shadcn/UI, next-i18next
- Framer Motion (animations), React Hook Form

**Mobile (iOS + Android):**
- React Native, Expo, TypeScript, NativeWind
- React Navigation, i18n-js, expo-camera, expo-notifications

**Backend:**
- Node.js 20, Express.js, TypeScript
- Supabase (PostgreSQL + Auth + Storage)
- Prisma ORM
- Claude API (analysis + generation)
- Stripe, Google Calendar, Telegram Bot API

**Automation & Infrastructure:**
- Antigravity (workflows, webhooks, cronjobs, notifications)
- GitHub Actions (CI/CD: lint, test, build, deploy)
- Vercel (frontend), Expo (mobile), Railway или Vercel Functions (backend)
- Sentry (error tracking), LogRocket (session replay), Vercel Analytics

---

## 📊 4-WEEK ROADMAP

### НЕДЕЛЯ 1: Фундамент
```
ДЕНЬ 1-2: Setup
  ✅ GitHub repo + CI/CD pipelines
  ✅ Figma Design System
  ✅ Supabase project
  ✅ Antigravity workflows
  ✅ Vercel + Railway

ДЕНЬ 3-4: Landing + Auth
  ✅ Landing page (Figma → Next.js)
  ✅ Google/Apple OAuth (Supabase Auth)
  ✅ Onboarding (язык + план + Stripe payment)

ДЕНЬ 5-7: Letter Analysis
  ✅ Upload UI (фото/PDF)
  ✅ OCR integration (tesseract.js)
  ✅ Claude API анализ
  ✅ Results UI
  ✅ Database schema + API
```

### НЕДЕЛЯ 2: Основные фичи
```
ДЕНЬ 1-2: Deadline Tracker
  ✅ Extract dates
  ✅ Google Calendar integration
  ✅ Email/SMS/Push reminders (Antigravity)
  ✅ Dashboard

ДЕНЬ 3-4: Document Checklist
  ✅ Extract documents
  ✅ Interactive checklist UI
  ✅ Export

ДЕНЬ 5-7: Response Generation
  ✅ [🤖 AI / 📝 Template / ✍️ Manual] selector
  ✅ Claude second call (письмо на немецком)
  ✅ PDF/Email/Telegram export
  ✅ Regenerate + Edit
```

### НЕДЕЛЯ 3: Мобила
```
ДЕНЬ 1-3: React Native Setup
  ✅ Expo project
  ✅ Navigation
  ✅ Design System (NativeWind)
  ✅ Camera integration

ДЕНЬ 4-5: Notifications + Sync
  ✅ Push notifications
  ✅ WebSocket sync
  ✅ Offline mode

ДЕНЬ 6-7: Polish
  ✅ Testing (iPhone + Android)
  ✅ Performance optimization
```

### НЕДЕЛЯ 4: Запуск
```
ДЕНЬ 1-2: QA
  ✅ Regression testing
  ✅ Security audit
  ✅ Performance testing

ДЕНЬ 3: Production Deploy
  ✅ amthelper.com live
  ✅ App Store + Google Play submission

ДЕНЬ 4-7: Marketing & Beta
  ✅ 50 beta-тестеров
  ✅ Feedback collection
  ✅ Documentation
```

---

## 🔗 РАБОЧИЙ ПРОЦЕСС

### GitHub Flow
```
1. ТЫ: GitHub Issue (требование)
2. Я: feature branch → code → commit
3. CI/CD: lint, test, build, deploy staging
4. Antigravity: Slack alert "Ready for review"
5. ТЫ: staging.amthelper.com → feedback
6. Я: PR merge in develop
7. CI/CD: re-test, deploy staging
8. ТЫ: approve "Go live"
9. Я: merge develop → main
10. CI/CD: test, build, deploy production
11. USERS: видят изменения на amthelper.com
```

### Еженедельный цикл
```
ПН 9:00 — Planning (какие фичи, приоритеты)
ВТ-ЧТ — Development (я кодю, ты проверяешь staging вечером)
ПТ — Финализация (финальный OK → production deploy)
ВВ — Мониторинг (Antigravity смотрит за ошибками)
```

---

## 📁 DIRECTORY STRUCTURE

```
amthelper/
├── .github/workflows/ (CI/CD)
├── frontend/ (Next.js)
│   ├── app/, components/, lib/, locales/, styles/
├── mobile/ (React Native)
│   ├── app/, components/, lib/, locales/
├── backend/ (Node.js)
│   ├── src/ (routes, services, db, utils)
├── infra/ (Docker, Vercel, Railway configs)
├── docs/ (API, SETUP, ARCHITECTURE)
├── scripts/ (setup, deploy scripts)
└── README.md
```

---

## 🚀 GETTING STARTED

**Prerequisites:**
- Node.js 20+, Git, GitHub, Vercel, Supabase, Claude API, Stripe, Figma, Antigravity, Telegram

**Setup (День 1):**
```bash
git clone https://github.com/nikolay/amthelper.git
cd amthelper

# Install all dependencies
cd frontend && npm install && cd ..
cd mobile && npm install && cd ..
cd backend && npm install && cd ..

# Setup .env files (Supabase URL, Claude key, Stripe keys, etc.)
cp frontend/.env.example frontend/.env.local
cp mobile/.env.example mobile/.env
cp backend/.env.example backend/.env

# Start development
npm run dev
```

---

## ✅ SUCCESS CRITERIA

- ✅ amthelper.com live
- ✅ iOS app на App Store
- ✅ Android app на Google Play
- ✅ 50+ beta-тестеров
- ✅ 99%+ uptime
- ✅ < 500ms response time
- ✅ 4.5+ stars на App Store/Play Store

---

## 📞 COMMUNICATION

- **Telegram:** ежедневные обновления (9:00, 17:00, срочные вопросы)
- **Slack:** CI/CD alerts, ошибки, техническая информация
- **GitHub:** Issues, PRs, code comments
- **Figma:** дизайн + комментарии разработчику
