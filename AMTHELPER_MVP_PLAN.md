# AmtHelper MVP Plan (9 Weeks)
**Start Date:** 09.06.2026  
**Target Launch:** 06.08.2026  
**Status:** Active Development

---

## 📊 Market & Opportunity

**Target Market:** 500,000 Russian speakers in Germany  
**Competition:** 0 (no one targets Russian speakers for German official documents)  
**Current Solution:** People pay consultants €50-150 per document analysis  
**AmtHelper Value Prop:** All features for €4.99/month  

---

## 🎯 Core 5 Features (MUST-HAVE)

### 1. Document Analyzer
- Photo/PDF upload → OCR → Claude Vision analysis
- Output (30-60 seconds):
  - What is this letter (simple explanation in Russian)
  - What is required from you
  - When (deadline + red flag if critical)
  - Which documents to prepare (checkbox)
  - Step-by-step action plan

### 2. Deadline Tracker
- AI auto-extracts due dates from letters
- Calendar sync
- Reminders:
  - 7 days before → Email
  - 3 days before → SMS/Telegram
  - 1 day before → Push notification
  - Deadline day → RED ALERT
- **Impact:** One missed deadline = €100-1000 fine

### 3. Document Checklist
- AI auto-detects required documents from letter
- Interactive checkbox UI:
  - ☐ Passport (RU)
  - ☐ Residence permit
  - ☐ Income statement
  - ☐ Bank statement (3 months)
  - ☐ Employment contract
  - ☐ Meldebescheinigung
  - ☐ Marriage certificate
- Progress bar (X of N done)

### 4. Response Letter Generator (AI-POWERED - ГЛАВНЫЙ ФИЧЕР!)

**Three paths (пользователь выбирает):**

#### 🤖 [AI ГЕНЕРИРУЕТ] (MAIN PATH)
- Claude автоматически пишет ответное письмо
- Time: 15-30 seconds
- Language: German (Deutsch, formal "Sie")
- AI анализирует исходное письмо + ситуацию пользователя
- Генерирует правильное письмо с:
  - Correct structure (datum, anschrift, anrede, text, unterschrift)
  - Formal tone + legal aspects
  - User's personal data auto-inserted
- Результат показан красиво
- Options: [✏️ Edit] [🔄 Regenerate] [👍 Perfect!]
- Export: [📄 PDF] [📧 Email] [💬 Telegram] [🔗 Link]

#### 📝 [Выбрать из готовых шаблонов]
- Стандартный ответ
- Просьба о продлении срока
- Уточнение информации
- Возражение (Widerspruch)

#### ✍️ [Написать самому]
- Text editor для полного контроля

**Cost:** 2 Claude API calls per letter = ~€0.002

### 5. 5 Ready-to-Use Templates
- Finanzamt (налоговая)
- Anmeldung (регистрация)
- Ausländerbehörde (иностранное управление)
- Krankenversicherung (страховка)
- Jobcenter (пособие)

- Claude writes formal German letter (formal "Sie", proper structure)
- Features:
  - Date, recipient, subject, body, signature
  - Regenerate / Edit / Export as PDF
  - Copy to clipboard
  - Save draft history
- **Quality:** Legally correct German, no errors

### 5. 5 Ready Templates
- **Finanzamt** (taxes)
- **Anmeldung** (registration)
- **Ausländerbehörde** (foreign office)
- **Krankenversicherung** (health insurance)
- **Jobcenter** (benefits)

---

## 💰 Monetization (ПОЛНАЯ МОДЕЛЬ)

### Pricing Tiers:

**🆓 Free Tier:**
- 5 document analyses per month
- 5 basic templates
- Community access
- Basic deadline notifications (no reminders)
- Goal: Привлечение + реклама

**💎 Pro Tier (€4.99/month):**
- ✅ Unlimited document analyses
- ✅ 50+ premium templates
- ✅ Deadline tracking + notifications (Email/SMS/Push)
- ✅ Document checklists
- ✅ AI Letter Generator (Claude-powered, formal German)
- ✅ Mobile app (iOS + Android)
- ✅ PDF export + email/Telegram sharing
- ✅ Response history & archive
- Primary revenue stream (массовой пользователь)

**🏢 Business Tier (€14.99/month):**
- ✅ All Pro features
- ✅ Team management (3-5 сотрудников)
- ✅ Admin Dashboard: analytics, usage tracking, performance metrics
- ✅ Webhooks & API access
- ✅ Advanced security (SSO, IP whitelist, audit logs)
- ✅ Custom templates per firm
- ✅ Priority support (2-hour response)
- ✅ Team member role management
- Target: Иммиграционные фирмы + агентства
- ROI for firm: €1,400+/month labor cost savings (€1500→€100)

**🔌 Developer/API Tier (custom pricing €1000-5000+/month):**
- Custom API endpoints, webhooks, white-label option, dedicated support

### Revenue Forecast:

**Year 1:** 10,000 users target
- Free: 8,000 (80%) = привлечение
- Pro: 1,500 × €4.99 = €7,485/month
- Business: 100 firms × €14.99 = €1,499/month
- API/Dev: €500-1,000/month
- **Total Year 1:** €8,984-9,484/month = €107,800-113,800/year

**Year 2-3:** €300k-1M+/year (with organic growth + paid ads)


---

## 🔧 Developer Control & Workflow

### Developer Control Panel (для нас с тобой)
Мониторинг всех систем в одном месте:
- **Version Control:** Current (production) vs Staging vs Development
- **System Health:** Vercel ✅, Supabase ✅, Claude API ✅, Stripe ✅, Telegram ✅
- **Active Issues:** CRITICAL/HIGH/MEDIUM с assignee, due date, status
- **Live Metrics:** Active users, API calls/hour, error rate, response time, DB CPU/memory
- **Feature Flags:** Быстро включить/выключить фичи, A/B тесты
- **Deployment Pipeline:** Staging → Production контроль

### Git Workflow (как мы работаем)
**Branches:**
- `main` (production) — боевой код, live на amthelper.com
- `staging` → `develop` → `feature/*` (новые фичи)

**Process:**
1. Я создаю feature branch (`feature/название`)
2. Пишу код → commit → push
3. GitHub Actions автоматом: ESLint, TypeScript, Jest тесты
4. Создаю Pull Request (с description)
5. Ты проверяешь код + staging.amthelper.com
6. Даёшь OK или feedback
7. Я мержу в develop
8. CI/CD деплоит на staging
9. Когда готово → merge develop → main → auto-deploy production

### Team Communication
- **Telegram:** быстрые вопросы & daily updates
- **Slack:** работа с ботами & notifications
- **GitHub:** код, issues, pull requests
- **Figma:** дизайн & dev comments

### Weekly Cycle
- **Пн 9:00:** Планирование (какие фичи на неделю)
- **Вт-Чт:** Разработка (я кодю, вечером ты проверяешь staging)
- **Пт:** Финализация (merge→production deploy)
- **Выходные:** Мониторинг (Antigravity ловит ошибки)

### Monitoring & Alerting
- **Sentry:** Error tracking & performance
- **LogRocket:** Session replay (видим что делал юзер если ошибка)
- **Vercel Analytics:** Frontend performance
- **Slack/Telegram:** Critical alerts

---

## 📊 Success Metrics

By **Week 9 (Launch Day):**
- ✅ Все 5 фичей работают (Document Analyzer, Deadline Tracker, Checklist, Generator, Templates)
- ✅ 4 языка完全 (DE/RU/UK/EN)
- ✅ Web на Vercel, Mobile на App Store + Google Play
- ✅ Stripe платежи работают
- ✅ Claude анализирует письма за <30 сек
- ✅ Zero critical bugs в production
- ✅ Performance: <3s TTFB (Time to First Byte)
- ✅ 100+ beta users в первую неделю



### Frontend (Web)
- **Framework:** Next.js 14 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Hosting:** Vercel

### Mobile
- **Framework:** React Native (Expo)
- **Build:** EAS Build
- **Deployment:** App Store + Google Play

### Backend
- **Database:** Supabase (PostgreSQL, Auth, Realtime)
- **Serverless:** Vercel functions
- **Storage:** Supabase Storage (documents)

### AI & Processing
- **LLM:** Claude API (Vision + Text)
- **OCR:** tesseract.js (browser-side)

### Payments
- **Provider:** Stripe
- **Model:** Subscription (SaaS)

### Database Schema
```sql
users (id, email, language, tier, stripe_customer_id, created_at)
documents (id, user_id, file_url, title, type, analyzed_data JSON, created_at)
deadlines (id, user_id, document_id, due_date, status, reminder_sent)
checklists (id, user_id, document_id, items JSONB, completed_count)
responses (id, user_id, document_id, template, generated_text, user_edits, status)
```

---

## 📅 Timeline (9 Weeks)

### **Week 1-2: Backend & Infrastructure** (09-22.06)

**Goal:** API + OCR working locally

**Tasks:**
- [ ] GitHub repo `amthelper` (.gitignore, README)
- [ ] Supabase project setup
  - [ ] Database schema created
  - [ ] Auth configured (email + OAuth Google)
  - [ ] RLS policies enabled
  - [ ] Storage bucket for documents
- [ ] Stripe account setup
  - [ ] Product created (€4.99/month)
  - [ ] Webhook configured
  - [ ] Test mode keys
- [ ] Next.js scaffold
  ```bash
  npx create-next-app@latest amthelper --typescript --tailwind --app
  ```
- [ ] Environment setup (.env.local)
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - CLAUDE_API_KEY
  - STRIPE_SECRET_KEY
  - STRIPE_WEBHOOK_SECRET
- [ ] Backend API routes
  - [ ] `POST /api/auth/signin` — Supabase auth
  - [ ] `POST /api/auth/signup` — User registration
  - [ ] `POST /api/documents/upload` — File upload + OCR trigger
  - [ ] `POST /api/documents/analyze` — Claude Vision analysis
  - [ ] `POST /api/responses/generate` — Letter generation
  - [ ] `POST /api/stripe/webhook` — Payment events
  - [ ] `GET /api/user/preferences` — User settings
- [ ] OCR Pipeline
  - [ ] tesseract.js integration
  - [ ] PDF → text extraction
  - [ ] Image preprocessing (tesseract-core)
- [ ] DSGVO Compliance
  - [ ] Cookie banner (CookieConsent)
  - [ ] Impressum page (German required)
  - [ ] Privacy Policy template
  - [ ] localStorage for consent tracking

**Deliverables:**
- ✅ GitHub repo live (with CI/CD)
- ✅ Supabase database + auth working
- ✅ Stripe webhook receiving test payments
- ✅ localhost:3000 responds
- ✅ OCR tested with sample PDFs
- ✅ API routes tested in Postman/curl
- ✅ All .env variables configured

---

### **Week 3-4: Web Frontend** (23-30.06)

**Goal:** Full web UI + Claude integration

**Tasks:**
- [ ] Authentication Pages
  - [ ] `/auth/signin` — Email + password
  - [ ] `/auth/signup` — Registration form
  - [ ] OAuth flow (Google)
  - [ ] `/auth/reset-password` — Reset link
  - [ ] Email verification
- [ ] Dashboard Layout
  - [ ] Sidebar navigation
  - [ ] Header (user menu, language selector, upgrade CTA)
  - [ ] Responsive design (mobile-first)
- [ ] Document Upload & Analysis
  - [ ] Drag-and-drop zone
  - [ ] File picker button
  - [ ] Progress bar (upload → OCR → analysis)
  - [ ] Display extracted data
  - [ ] Edit extracted text
  - [ ] Save to database
- [ ] Claude Vision Integration
  - [ ] API call → extract:
    - document_type (Finanzamt, Anmeldung, etc.)
    - key_dates (due dates, submission dates)
    - amounts (money involved)
    - sender (which authority)
    - urgency_score (1-5)
    - suggested_template (index)
  - [ ] Error handling (retry logic)
  - [ ] Caching (avoid duplicate requests)
- [ ] Deadline Tracker
  - [ ] List view (all deadlines)
  - [ ] Status badges (open, done, overdue)
  - [ ] Edit deadline (date, notes)
  - [ ] Mark as completed
  - [ ] Email reminder toggle
- [ ] Checklist Builder
  - [ ] Dynamic item list (add/remove/edit)
  - [ ] Checkbox UI (persist state)
  - [ ] Progress bar (X of N done)
  - [ ] Share link (read-only preview)
  - [ ] Export as JSON/PDF
- [ ] Response Letter Generator
  - [ ] Select document + template
  - [ ] Claude generates letter
  - [ ] Display in editable textarea
  - [ ] Regenerate button (new version)
  - [ ] Edit & format
  - [ ] Export as PDF
  - [ ] Copy to clipboard
  - [ ] Share via email/WhatsApp
  - [ ] Save draft history
- [ ] Settings Page
  - [ ] Language selector (DE, RU, UK, EN)
  - [ ] Email for notifications
  - [ ] Subscription tier display
  - [ ] Account logout
  - [ ] Delete account (DSGVO)
- [ ] Billing Page
  - [ ] Pricing table (Free vs Pro features)
  - [ ] Stripe checkout button
  - [ ] Invoice history (Supabase query)
  - [ ] Cancel subscription option

**Deliverables:**
- ✅ All pages navigable + functional
- ✅ Auth flow working (email + OAuth tested)
- ✅ Full document lifecycle: upload → analyze → display
- ✅ Deadline notifications working
- ✅ Letter generation + export tested
- ✅ Stripe checkout button functional (test mode)
- ✅ Mobile responsive (Tailwind breakpoints)
- ✅ Dark/light mode (optional, nice-to-have)

---

### **Week 5-6: Mobile App (React Native)** (01-15.07)

**Goal:** iOS + Android ready

**Tasks:**
- [ ] Expo Project Setup
  ```bash
  npx create-expo-app amthelper-mobile
  npm install @supabase/supabase-js expo-camera expo-notifications
  ```
- [ ] Authentication (Mobile)
  - [ ] Deep link handling (from web auth)
  - [ ] Token storage (SecureStore)
  - [ ] Auto-refresh on app launch
  - [ ] Logout flow
- [ ] Document Upload (Mobile)
  - [ ] Camera integration
  - [ ] Photo library picker
  - [ ] Upload to Supabase Storage
  - [ ] Trigger Claude analysis
  - [ ] Show progress
- [ ] Tab Navigation
  - [ ] Documents tab (list + upload)
  - [ ] Deadlines tab (upcoming + alerts)
  - [ ] Responses tab (generated letters)
  - [ ] Account tab (settings + profile)
- [ ] Deadline Notifications
  - [ ] expo-notifications setup
  - [ ] Schedule local + push
  - [ ] 7-day, 3-day, 1-day, deadline reminders
  - [ ] Notification tap → app navigation
- [ ] Letter Preview & Export
  - [ ] View generated responses
  - [ ] Share via email/WhatsApp/Telegram
  - [ ] Export as PDF (share-pdf)
  - [ ] Copy to clipboard
- [ ] Offline Mode (nice-to-have)
  - [ ] Cache recent documents
  - [ ] Queue uploads when offline
  - [ ] Sync when online
- [ ] Testing
  - [ ] Manual iOS testing (physical device + simulator)
  - [ ] Manual Android testing (physical device + emulator)

**Deliverables:**
- ✅ Expo project compiles + runs
- ✅ iOS TestFlight link available
- ✅ Android APK + internal testing link
- ✅ Full login → dashboard → upload → results flow
- ✅ Notifications trigger correctly
- ✅ Sync with web (same Supabase account, same data)

---

### **Week 7-8: Polish & i18n** (16-29.07)

**Goal:** Production-ready, all languages + tests

**Tasks:**
- [ ] Performance Optimization
  - [ ] Image optimization (Next.js Image)
  - [ ] Code splitting (lazy load)
  - [ ] Database indexes (Supabase)
  - [ ] Claude API caching (avoid duplicates)
  - [ ] Lighthouse score >90
- [ ] Error Handling & UX
  - [ ] Toast notifications (success, error, info)
  - [ ] Retry logic (failed uploads, API timeouts)
  - [ ] Skeleton loaders (while fetching)
  - [ ] Offline state UI
  - [ ] Error boundary (React)
  - [ ] Graceful degradation
- [ ] Localization (i18n)
  - [ ] Setup i18n-js or next-i18next
  - [ ] German (DE) — all strings
  - [ ] Russian (RU) — all strings
  - [ ] Ukrainian (UK) — all strings
  - [ ] English (EN) — all strings
  - [ ] All 5 templates translated
  - [ ] Date/number formatting per locale
  - [ ] Right-to-left support (if needed)
- [ ] Testing
  - [ ] Unit tests (jest)
    - Auth utils
    - API helpers
    - Date parsing
  - [ ] E2E tests (Playwright)
    - Login → upload → analyze → generate → export
    - All 5 document types
    - Deadline creation + reminders
    - Payment flow (test mode)
  - [ ] Manual QA
    - All 5 templates × 3 languages (at least)
    - Mobile + web
    - Different screen sizes
- [ ] Analytics (Optional)
  - [ ] Setup Segment or Posthog
  - [ ] Track events: signup, document_uploaded, response_generated, payment_completed
  - [ ] Conversion funnel
- [ ] Security Audit
  - [ ] SQL injection tests (RLS policies)
  - [ ] XSS tests (input sanitization)
  - [ ] CORS configuration
  - [ ] Rate limiting (API endpoints)
  - [ ] Secrets management (no hardcoding)

**Deliverables:**
- ✅ All 5 document templates fully working
- ✅ All 4 languages (DE, RU, UK, EN) complete
- ✅ Both platforms production-ready
- ✅ E2E tests passing (all critical flows)
- ✅ Performance: <3s TTFB, <1s interactive
- ✅ Lighthouse >90
- ✅ 0 console errors

---

### **Week 9: Deploy & Launch** (30.07-06.08)

**Goal:** Production live + soft launch

**Tasks:**
- [ ] Web Deployment (Vercel)
  - [ ] Connect GitHub repo
  - [ ] Environment variables (PROD keys)
  - [ ] Custom domain (amthelper.de or amthelper.io)
  - [ ] SSL certificate (auto-managed by Vercel)
  - [ ] Preview deployments on PRs
  - [ ] Monitoring (Sentry, Vercel Analytics)
- [ ] Mobile Deployment (EAS)
  - [ ] EAS login + setup
  - [ ] Build iOS (ipa file)
  - [ ] Build Android (apk + aab)
  - [ ] iOS Provisioning profiles
  - [ ] Android signing key
  - [ ] Submit to App Store (review process ~24h)
  - [ ] Submit to Google Play (review process ~2-4h)
  - [ ] TestFlight internal testing link (iOS)
  - [ ] Google Play internal testing link (Android)
- [ ] Database & Monitoring
  - [ ] Supabase automated backups enabled
  - [ ] Database monitoring (connection logs)
  - [ ] Sentry error tracking (web + mobile)
  - [ ] Uptime monitoring (status page)
  - [ ] Email alerts for critical errors
- [ ] Launch Checklist
  - [ ] Stripe live keys (production)
  - [ ] DSGVO compliant (cookie consent saved)
  - [ ] Privacy Policy live + linked
  - [ ] Impressum active (German required)
  - [ ] Support email configured (support@amthelper.de)
  - [ ] Onboarding email sequence (setup)
  - [ ] Contact form on website
- [ ] Soft Launch (Week 9)
  - [ ] Invite 50 beta users (friends, contacts, early supporters)
  - [ ] Telegram channel for feedback (@AmtHelperBeta)
  - [ ] Feedback form (Typeform or custom)
  - [ ] Fix critical bugs (48h turnaround)
  - [ ] Monitor:
    - Error rates (Sentry)
    - API latency (Supabase logs)
    - Payment success rate (Stripe dashboard)
    - User feedback (Telegram, email)
- [ ] Public Launch (Week 10+)
  - [ ] Twitter/X announcement (DE + RU)
  - [ ] ProductHunt submission (optional)
  - [ ] Email to contacts
  - [ ] Telegram channel announcement (@AmtHelperOfficial)
  - [ ] Reddit r/germany + r/russian posts
  - [ ] LinkedIn announcement (your profile)
  - [ ] Press release (optional)

**Deliverables:**
- ✅ Web live at amthelper.de (HTTPS, SSL)
- ✅ Mobile on Apple App Store (iOS)
- ✅ Mobile on Google Play Store (Android)
- ✅ 0 critical bugs in production
- ✅ Stripe payments working (real transactions)
- ✅ Monitoring + alerting in place
- ✅ 50+ beta users with feedback collected
- ✅ Public launch announcement done

---

## 🎯 Critical Success Factors

1. **Week 1:** Backend + OCR = foundation (everything else depends on this)
2. **Week 2:** API routes tested in Postman, Claude integration working in sandbox
3. **Week 3:** Web + auth (don't delay — blocks mobile development)
4. **Week 5:** Mobile ready on Expo (can iterate without App Store initially)
5. **Week 7:** All 4 languages + all 5 templates working (no "coming soon")
6. **Week 9:** Production deployment (not staging), real users + feedback loop

---

## ⚡ Key Dependencies

1. **Claude API Key** — absolutely required (vision + text generation)
2. **Supabase Account** — database + auth working
3. **Stripe Account** — subscription processing
4. **GitHub Account** — version control + CI/CD
5. **Vercel Account** — web hosting
6. **EAS Account** — mobile builds (Expo)

---

## 🚀 Day 1 Tasks (Start Now)

```bash
# 1. Create GitHub repo
git init amthelper
cd amthelper
git remote add origin https://github.com/YOUR_USERNAME/amthelper.git

# 2. Create Next.js app
npx create-next-app@latest . --typescript --tailwind --app

# 3. Install dependencies
npm install @supabase/supabase-js stripe

# 4. Setup .env.local
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLAUDE_API_KEY=your_claude_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
EOF

# 5. Create first API route
mkdir -p app/api/auth
cat > app/api/auth/signin/route.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json(data)
}
EOF

# 6. Start dev server
npm run dev
```

**Result:** localhost:3000 responds, Supabase connected, API route working.

---

## 📝 Important Notes

### MVP Philosophy
- **Fast > Perfect** — Launch MVP with 3 templates + 2 languages = already winning
- **Feedback Loop** — Soft launch with 50 users to catch real-world issues
- **Iterate** — Post-launch features based on user demand

### Post-Launch Features (Not in MVP)
- Batch upload (multiple docs at once)
- Document search + tagging
- Custom templates (Pro feature)
- Telegram bot integration (notifications)
- Email digest (weekly summary)
- Analytics dashboard
- API for integrations

### Market Reality
- 500,000 Russian speakers in Germany
- 0 competitors doing this specifically
- People currently pay €50-150 per document consultation
- This is a goldmine if executed fast

### Success Metrics
- Week 9: Product live + 50 beta users
- Month 2: 500 users (organic + ProductHunt)
- Month 3: 2,000 users + first paid subscriptions (20% conversion = 400 paying = €19,200/month)
- Year 1: €100k+ revenue

---

## 📞 Support & Updates

**Last Updated:** 2026-06-09  
**Status:** Ready to start  
**Next Step:** GitHub repo + Supabase setup (Day 1)

---

**Let's build this! 🚀**
