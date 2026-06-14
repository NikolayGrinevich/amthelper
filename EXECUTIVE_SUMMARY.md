# 📋 EXECUTIVE SUMMARY — AmtHelper MVP

**Проект:** AmtHelper — AI-powered SaaS для русскоязычных мигрантов в Германии  
**Период:** 9 недель (09.06.2026 → 06.08.2026)  
**Дата этого документа:** 09.06.2026  
**Автор:** Николай Гриневич (Соучастник)

---

## 🎯 ЧТО МЫ СТРОИМ

**AmtHelper** — премиум приложение, которое анализирует немецкие письма от Finanzamt, Ausländerbehörde и других госучреждений за 30 секунд, объясняет на русском, создаёт чеклист документов и генерирует готовый ответ на немецком.

**Проблема:** Письма на немецком, непонимание, боязнь ошибиться → консультант стоит €50-150  
**Решение:** AmtHelper за €4.99/месяц → экономия €600+/год на одного пользователя

---

## 💡 КЛЮЧЕВАЯ ИНФОРМАЦИЯ

### **РЫНОК**
- Целевая аудитория: 500,000 русскоговорящих в Германии
- Конкуренция: **0 (ниша полностью пуста)**
- Current price point: консультант €50-150 на письмо
- Our price: €4.99/месяц (Free + Pro)

### **ТЕХНОЛОГИЯ**
- **Web:** Next.js 15.x + React 19 + TypeScript + shadcn/ui
- **Mobile:** React Native / Expo (iOS + Android)
- **Backend:** Vercel Functions + Supabase PostgreSQL
- **AI:** Anthropic Claude 3.5 Sonnet (vision + text generation)
- **Payments:** Stripe (€4.99/mo subscriptions)
- **Email:** Resend (deadline reminders)
- **Deploy:** Vercel (web) + EAS (mobile)

### **MONETIZATION**
- **Free tier:** €0 (5 documents/month, analysis only) — 90% conversion target
- **Pro tier:** €4.99/month (unlimited, all features) — 10% conversion target
- **Business tier:** v2.0 (€14.99/month after 100 Pro users)

### **5 ОСНОВНЫХ ФИЧЕЙ**
1. **Document Analyzer** — Claude Vision анализирует письма (2-5 сек)
2. **Deadline Tracker** — Email напоминания о сроках (7, 3, 1 день)
3. **Document Checklist** — Интерактивный чеклист по типу документа
4. **Letter Generator** (ГЛАВНАЯ) — Claude пишет формальное письмо на немецком
5. **5 Pre-made Templates** — Beschwerde, Einspruch, Anfrage, etc.

### **МНОГОЯЗЫЧНОСТЬ (с дня 1)**
- **Поддержка:** DE, RU, UK, EN
- **Web:** next-i18next
- **Mobile:** i18n-js (shared JSON files)
- **Синхронизация:** Переводы идут параллельно с разработкой фич

---

## 📊 ФИНАНСОВЫЙ ПРОГНОЗ (Year 1)

| Период | Пользователи | Pro Conversion | Доход | Net |
|--------|-------------|---|---|---|
| Месяц 1-2 | 100 | 10% | €49.90 | -€850 |
| Месяц 3-6 | 500 | 15% | €249-499 | -€650 to -€400 |
| Месяц 7-9 | 1500 | 20% | €1497 | BREAKEVEN ✅ |
| Месяц 12 | 5000 | 25% | €6237 | +€5337 ✅ |
| **Итого год** | - | - | **€12-15k** | **PROFITABLE** |

**Фиксированные расходы:** €611-1291/месяц  
**Главный cost driver:** Claude API (€500-1000/месяц)

---

## ⚙️ ТЕХНИЧЕСКИЙ ДИЗАЙН (HIGH LEVEL)

```
CLIENT LAYER (Web + Mobile)
    ↓
API LAYER (Vercel Functions)
    ↓
SERVICE LAYER:
    ├── Claude API (Document analysis + Letter generation)
    ├── Supabase Auth + RLS (User management + security)
    ├── Stripe Webhooks (Subscription sync)
    └── Resend (Email reminders)
    ↓
DATA LAYER (PostgreSQL):
    ├── users (auth, subscription, preferences)
    ├── documents (uploads, analysis results)
    ├── letters (generated responses)
    ├── templates (5 pre-made)
    ├── reminders (deadline alerts)
    └── usage_tracking (rate limiting, analytics)
```

---

## 📅 TIMELINE (9 НЕДЕЛЬ)

| Неделя | Задача | Результат |
|--------|--------|-----------|
| 1-2 | Инфра + многоязычность + мобайл skeleton | Vercel + Supabase live, i18n ready |
| 3-4 | Основные фичи (web + mobile параллельно) | Analyzer, Tracker, Checklist, Generator |
| 5 | Stripe webhooks + monetization | Subscriptions work end-to-end |
| 6 | 5 шаблонов + polish | Templates ready, UI refined |
| 7-8 | QA + security + app store prep | All tests pass, ready for release |
| 9 | **GO LIVE** | Web + Mobile production 🚀 |

---

## ✨ ЧТО ДЕЛАЕМ ПАРАЛЛЕЛЬНО

✅ **Web (Next.js) + Mobile (React Native)** — одновременно, не последовательно  
✅ **Многоязычность (DE/RU/UK/EN)** — встроена в разработку, не откладывается  
✅ **Monetization** — Stripe webhook с самого начала  
✅ **Мобайл на production** — вместе с веб в неделе 9

---

## 🚨 КРИТИЧЕСКИЕ РИСКИ

| Категория | Риск | Chance | Mitigation |
|-----------|------|--------|-----------|
| **Tech** | Claude API rate limits | Medium | Caching + fallback templates |
| **Tech** | App Store rejection | Low | Early submission, legal review |
| **Business** | Low user acquisition | Medium | Target Russian communities |
| **Business** | Low Pro conversion | Medium | A/B test pricing, better onboarding |
| **Ops** | Developer burnout (solo, 9 weeks) | High | Delegate UI to Claude Code |

---

## ✅ КРИТЕРИИ УСПЕХА

**Week 2:** Vercel deployed, Supabase ready, first API call works  
**Week 4:** Can analyze documents + generate letters end-to-end  
**Week 5:** Stripe subscriptions working  
**Week 8:** All features tested, app store submissions ready  
**Week 9:** **LIVE in production, collecting first users** 🎉

**Month 3:** 100 signups, 10% Pro conversion = €50/месяц revenue  
**Month 6:** 500 signups, 15% conversion = €500/месяц (approaching breakeven)  
**Month 12:** 5000 signups, 25% conversion = €6200/месяц (PROFITABLE)

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ

1. ✅ **Сохранен план:** `AMTHELPER_MVP_PLAN_FINAL.md`
2. ✅ **Сохранен анализ:** `SYSTEM_ANALYSIS.md`
3. 🔜 **Неделя 1 начинается:**
   - [ ] Fix Next.js to 15.1.x
   - [ ] Create GitHub repo + CI/CD
   - [ ] Setup Supabase project
   - [ ] Setup next-i18next
   - [ ] Create Expo skeleton
   - [ ] Deploy to Vercel (test)

---

**Статус:** PRE-PRODUCTION ✅  
**Готов к запуску:** ДА ✅  
**Начинаем неделю 1:** СЕЙЧАС 🚀
