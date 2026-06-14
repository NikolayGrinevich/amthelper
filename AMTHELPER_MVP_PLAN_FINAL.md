# 🎯 **AmtHelper MVP — 9 НЕДЕЛЬ (ФИНАЛЬНЫЙ ПЛАН)**
**Дата старта:** 09.06.2026 | **Production:** 06.08.2026

---

## ✅ **КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ**

### 1️⃣ **Next.js версия: 15.x (не 16.2.7)**
```bash
npm install next@15 react@19 react-dom@19
```

### 2️⃣ **Мобайл — ДЕЛАЕМ, но после основной работы**
- React Native запуск в **Неделе 3** (параллельно с веб)
- Реальное тестирование в **Неделе 5-6**
- Production release мобайла вместе с веб в **Неделе 9**

### 3️⃣ **Многоязычность — с первого дня**
- DE, RU, UK, EN в **Неделе 1** (setup next-i18next)
- Переводы пишутся **параллельно** с разработкой фич (не откладываем)

### 4️⃣ **Business tier убираю до 100 платящих**

### 5️⃣ **CI/CD простой** (feature → main → deploy)

### 6️⃣ **Email: Resend**

---

## 📋 **9-НЕДЕЛЬНЫЙ ПЛАН**

### **ФАЗА 1: ИНФРА + SETUP (Недели 1–2)**

#### **Неделя 1: Фундамент**

**Backend + Инфра:**
- [ ] Исправить Next.js на 15.1.x
- [ ] GitHub repo + CI/CD (lint + build check)
- [ ] Supabase setup
  - [ ] Schema: users, documents, letters, templates, subscriptions
  - [ ] Authentication (email + OAuth)
  - [ ] RLS политики
- [ ] Vercel deploy (test)
- [ ] DSGVO Cookie Banner + Impressum
- [ ] Environment переменные (.env.local)

**Многоязычность (DE, RU, UK, EN):**
- [ ] Установить next-i18next
- [ ] Создать структуру переводов (public/locales/)
  - [ ] public/locales/de/common.json
  - [ ] public/locales/ru/common.json
  - [ ] public/locales/uk/common.json
  - [ ] public/locales/en/common.json
- [ ] Создать Language Selector компонент
- [ ] Настроить routing (немецкий как default)

**Мобайл (React Native):**
- [ ] Expo project (rnpm link required packages)
- [ ] Basic navigation structure (Tab navigator)
- [ ] Share backend API configuration
- [ ] Setup i18n-js для мобайла (синхрон с веб переводами)

**API Integration:**
- [ ] Anthropic Claude API ключ
- [ ] Stripe ключи (test mode)
- [ ] Resend ключ

#### **Неделя 2: Backend сервисы + Переводы**

**Backend:**
- [ ] Supabase API интеграция
- [ ] Stripe клиент (pricing table, subscriptions)
- [ ] Claude API endpoints
  - [ ] /api/analyze-document (OCR + Vision)
  - [ ] /api/generate-letter (text generation)
- [ ] Resend email integration
- [ ] Deploy на Vercel (production-like)

**Многоязычность (продолжение):**
- [ ] Перевод основных UI элементов (EN, RU, UK)
- [ ] Немецкие шаблоны писем (уже на немецком)
- [ ] Перевод error messages, notifications
- [ ] Тестирование переключение языков

**Мобайл:**
- [ ] API client (fetch конфиг)
- [ ] Authentication flow (Mobile auth)
- [ ] Basic screens (Dashboard, Settings)
- [ ] i18n настройка (использовать те же JSON файлы)

---

### **ФАЗА 2: ОСНОВНЫЕ ФИЧИ (Недели 3–4)**

#### **Неделя 3: UI + Документы + Переводы II**

**Web Frontend:**
- [ ] Design system (shadcn/ui + Tailwind)
  - [ ] Dark mode (параллельно с многоязычностью)
  - [ ] Responsive layout
- [ ] Dashboard
- [ ] Document upload widget
- [ ] Settings страница

**Mobile (параллельно):**
- [ ] Основной layout (Bottom Tab Navigator)
- [ ] Document upload (камера + файл)
- [ ] Settings screen
- [ ] Responsive UI на NativeWind / Tailwind RN

**Многоязычность:**
- [ ] Переводы UI компонентов (DE, RU, UK, EN)
- [ ] Переводы Dashboard текстов
- [ ] Переводы Settings
- [ ] Переводы Upload workflow

#### **Неделя 4: Ядро фич + Переводы III**

**Web:**
- [ ] **Document Analyzer**
  - [ ] Upload → Claude Vision → результаты
  - [ ] Извлечение: тип, отправитель, дата, сроки, ключи
  - [ ] UI карточка с copy-to-clipboard
  
- [ ] **Deadline Tracker**
  - [ ] Календарь + сроки
  - [ ] Email напоминание (7 дней)
  
- [ ] **Document Checklist**
  - [ ] Интерактивный чеклист
  
- [ ] **Letter Generator** (ГЛАВНАЯ)
  - [ ] Форма ввода: "Что ответить?"
  - [ ] Claude генерирует письмо (немецкий Sie)
  - [ ] Edit + Regenerate + Use
  - [ ] Export: PDF, Email, Link

**Mobile (параллельно):**
- [ ] Document Analyzer (упрощённый UI)
- [ ] Deadline Tracker (календарь на мобайле)
- [ ] Document Checklist
- [ ] Letter Generator (меньший шрифт, но то же)

**Многоязычность:**
- [ ] Переводы результатов анализа (типы документов, оценки)
- [ ] Переводы уведомлений (deadline alerts)
- [ ] Переводы Letter Generator (UI, инструкции)
- [ ] Переводы экспорта (PDF headers, email subject)

---

### **ФАЗА 3: MONETIZATION (Неделя 5)**

#### **Неделя 5: Stripe webhooks + логика подписок**

**🔴 Vercel deployment LIVE перед этой неделей!**

- [ ] Deploy на Vercel (production URL)
- [ ] Stripe webhook endpoint (/api/webhooks/stripe)
- [ ] Webhook events:
  - [ ] `customer.subscription.created` → Pro mark in DB
  - [ ] `customer.subscription.deleted` → Free downgrade
  - [ ] `invoice.payment_failed` → Email alert

- [ ] Rate limiting:
  - [ ] Free: 5 документов/месяц
  - [ ] Pro: неограниченно

- [ ] Paywall UI (web + mobile):
  - [ ] "Upgrade to Pro" button
  - [ ] Pricing page
  - [ ] Current tier display

**Mobile:**
- [ ] Paywall на мобайле (такой же)
- [ ] In-app subscription flow (опционально, можно через веб)

---

### **ФАЗА 4: ШАБЛОНЫ + POLISH (Неделя 6)**

#### **Неделя 6: 5 шаблонов + UX полировка**

**Templates (немецкие):**
1. **Beschwerde gegen Finanzamt**
2. **Einspruch gegen Steuerbescheid**
3. **Anfrage Steuernummer**
4. **Bescheinigung Gewinnermittlung**
5. **Widerspruch falsche Besteuerung**

**Web:**
- [ ] Template selection UI (карточки)
- [ ] Template preview
- [ ] "Use template" → pre-fill generator

- [ ] Polish:
  - [ ] Error boundaries
  - [ ] Loading spinners
  - [ ] Toast notifications
  - [ ] Keyboard shortcuts (Ctrl+Enter)
  - [ ] Animations (Framer Motion)

**Mobile:**
- [ ] Template selection (bottom sheet или cards)
- [ ] Touch-friendly interactions
- [ ] Same templates as web
- [ ] Polish animations on mobile

---

### **ФАЗА 5: TESTING + QA (Неделя 7–8)**

#### **Неделя 7: QA + Security**

**Web:**
- [ ] Manual testing (все фичи)
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive (DevTools)

**Mobile:**
- [ ] Device testing (iOS Simulator + Android Emulator)
- [ ] Real device testing (iPhone + Android phone)
- [ ] Camera permissions
- [ ] Push notifications setup

**Оба:**
- [ ] Security audit
  - [ ] Нет API ключей в клиент-коде
  - [ ] RLS политики ✅
  - [ ] CSRF защита
  - [ ] Rate limiting тест
- [ ] Performance:
  - [ ] Image compression (next/image)
  - [ ] Code splitting
  - [ ] Bundle size analysis
  - [ ] Mobile load time < 3s

#### **Неделя 8: Launch prep**

**Web + Mobile:**
- [ ] Мониторинг setup (Vercel Analytics, Sentry)
- [ ] Stripe live mode test
- [ ] Resend email test
- [ ] Support page + FAQ
- [ ] Launch announcement prep (Telegram, Reddit, сообщества)
- [ ] Backup setup
- [ ] Runbook для ошибок

**Mobile specific:**
- [ ] EAS build configuration
- [ ] TestFlight setup (iOS)
- [ ] Internal testing (Android)
- [ ] Store listing prep (Google Play, App Store)

---

### **ФАЗА 6: GO LIVE (Неделя 9)**

#### **Неделя 9: Production launch**

**Web:**
- [ ] Stripe live mode
- [ ] Final deploy
- [ ] Monitor logs

**Mobile:**
- [ ] Build final release (EAS)
- [ ] Submit to App Store (iOS)
- [ ] Submit to Google Play (Android)
- [ ] Start internal testing / beta

**Both:**
- [ ] Launch announcement
  - [ ] r/Germany
  - [ ] r/Russian
  - [ ] Telegram groups
  - [ ] Product Hunt (опционально)
  - [ ] Reddit r/expats
  
- [ ] Collect feedback
- [ ] Fix critical bugs
- [ ] Monitor metrics:
  - [ ] Signups/день
  - [ ] Free → Pro conversion
  - [ ] Feature usage (какие документы чаще)
  - [ ] Churn rate
  - [ ] App store ratings (mobile)

---

## 🏗️ **TECH STACK (ФИНАЛЬНЫЙ)**

| Слой | Технология | Заметка |
|------|-----------|---------|
| **Web Frontend** | Next.js **15.1.x**, React 19, TS, shadcn/ui, Tailwind 4 | ✅ Стабильно |
| **Mobile** | React Native (Expo), TypeScript, NativeWind | Параллельно с веб |
| **БД** | Supabase (PostgreSQL) + Auth | RLS, backup |
| **AI** | Anthropic Claude 3.5 Sonnet | Анализ + генерация |
| **Платежи** | Stripe | Subscriptions, webhooks |
| **Email** | Resend | Напоминания |
| **Хостинг** | Vercel (веб) + EAS (мобайл) | Auto-deploy |
| **i18n** | next-i18next (web) + i18n-js (mobile) | DE, RU, UK, EN с дня 1 |
| **UI Kit** | shadcn/ui (web) + NativeWind (mobile) | Shared design patterns |

---

## 💰 **MONETIZATION**

| Tier | Цена | Что входит |
|------|------|-----------|
| **Free** | €0 | 5 документов/месяц, только анализ |
| **Pro** | €4.99/месяц | Неограниченно, генерация, всё |
| **Business** | **v2.0** | Team, analytics, API |

**Year 1 прогноз:**
- Месяц 1-2: 100 signups, 10 Pro = **€49.90/месяц**
- Месяц 3-6: 500 signups, 100 Pro = **€499/месяц**
- Месяц 7-12: 2000 signups, 400 Pro = **€1,996/месяц**
- **Итого: €12-15k** (консервативно)

---

## 📊 **МЕТРИКИ УСПЕХА**

- **Конец недели 2:** Supabase + Vercel, многоязычность setup ✅, мобайл skeleton ✅
- **Конец недели 4:** Анализ + генерация на обоих (web + mobile) ✅
- **Конец недели 5:** Stripe live ✅
- **Конец недели 8:** 5 шаблонов, обо все готово к launch ✅
- **Неделя 9:** Оба продукта live (веб + мобайл), метрики собираются ✅

---

## ✨ **ИТОГОВОЕ РЕЗЮМЕ**

**Что делаем параллельно с день 1:**
1. ✅ Web (Next.js) + Mobile (React Native) одновременно
2. ✅ Многоязычность (DE/RU/UK/EN) встроена в фичи, не откладывается
3. ✅ Обе платформы на production в неделе 9

**Что откладываем:**
- ❌ Business tier (v2.0 после 100 платящих)
- ❌ Дополнительные языки (китайский, французский и т.д.)
- ❌ Mobile-only фичи (offline mode, syncing)

**Почему так работает:**
- Код шарится между веб и мобайлом (API интеграция)
- Переводы синхронизированы (один JSON → оба приложения)
- Параллельная разработка экономит время на интеграцию потом
- MVP готов полностью (веб + мобайл + многоязычность) в неделе 9

**Готов к запуску?**
