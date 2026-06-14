# 📋 AmtHelper Week 2 Checklist — Backend Services

## ✅ COMPLETED

### Backend Services
- [x] Supabase API client configured (lib/supabase/)
- [x] Stripe integration complete (lib/stripe.ts)
- [x] Claude Vision API endpoints (app/api/documents/analyze)
- [x] Letter generation endpoint (app/api/generate)
- [x] Stripe webhook endpoint (app/api/stripe/webhook)
- [x] Supabase auth integration

### Database Schema
- [x] users table (Supabase)
- [x] documents table (Supabase)
- [x] subscriptions table (Supabase)
- [x] RLS policies configured

### Environment
- [x] .env.local configured with:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - ANTHROPIC_API_KEY
  - STRIPE_SECRET_KEY
  - STRIPE_PUBLIC_KEY

## ⏳ IN PROGRESS

### Email Service (Resend)
- [ ] Install resend npm package
- [ ] Create email templates (verification, deadline reminders)
- [ ] Integrate into auth flow
- [ ] Test email delivery

### Deployment Preparation
- [ ] Create Vercel project
- [ ] Configure environment variables in Vercel
- [ ] Setup production Stripe keys (replace test keys)
- [ ] Test deployment preview
- [ ] Configure custom domain

## 📝 NEXT WEEK (Week 3+)
- Frontend components (sign-in, dashboard, document upload)
- Mobile app (Expo) setup
- UI/UX with shadcn/ui
- Translation files (i18n)
- Testing framework setup

## 🚀 LOCAL TESTING
```bash
cd /c/HERMES/projects/amthelper
npm run dev
# Visit http://localhost:3000
```

## 📊 PROGRESS
- **Week 1:** ✅ 100% (Scaffold + i18n + DB schema)
- **Week 2:** 🟡 80% (Backend services ready, email + deploy pending)
- **Remaining:** Weeks 3-9 (UI + Features + Launch)

---
**Generated:** 2026-06-10 | **Status:** On Track
