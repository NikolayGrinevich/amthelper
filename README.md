# AmtHelper MVP — Week 1 Ready

**Status:** ✅ Week 1 scaffolding complete  
**Start Date:** 09.06.2026  
**Launch Target:** 06.08.2026 (9 weeks)

## 📦 What's Ready

### Web (Next.js)
- ✅ Next.js 16 + TypeScript + Tailwind
- ✅ API routes: auth (signin/signup), documents (analyze), responses (generate), stripe (webhook)
- ✅ Supabase clients (browser + server)
- ✅ i18n setup (DE/RU/UK/EN) with translation files
- ✅ .env.local configured for local development
- ✅ tsconfig fixed for ES2020

**To Start Web:**
```bash
cd web
npm install
npm run dev
# localhost:3000
```

### Mobile (React Native + Expo)
- ✅ Expo project initialized with TypeScript
- ✅ Bottom tab navigation (Documents, Deadlines, Letters, Account)
- ✅ Auth state management
- ✅ Supabase client configured
- ✅ i18n (DE/RU/UK/EN) ready
- ✅ EAS build config (app.json + eas.json)

**To Start Mobile:**
```bash
cd mobile
npm install
npx expo start
# Scan QR code with Expo Go app
```

### Database (Supabase)
- ✅ SQL schema in `schema.sql` — ready to paste into Supabase
- ✅ Tables: users, documents, deadlines, checklists, responses
- ✅ RLS policies configured
- ✅ Indexes for performance

**To Deploy:**
1. Create Supabase project
2. Go to SQL Editor
3. Paste `schema.sql`
4. Set up auth providers (email, Google)
5. Create storage buckets: `documents`, `responses`

## 🔧 Next Steps (Week 1-2)

### Priority 1: Supabase Setup
- [ ] Create Supabase project
- [ ] Run schema.sql
- [ ] Configure auth (email + Google OAuth)
- [ ] Create storage buckets
- [ ] Copy keys to .env.local files (web + mobile)

### Priority 2: Backend API Testing
- [ ] Test auth endpoints in Postman
- [ ] Test Claude Vision integration with sample PDFs
- [ ] Test Stripe webhook locally (ngrok)
- [ ] Verify database RLS policies

### Priority 3: Web Frontend Pages
- [ ] Build sign-in/sign-up pages
- [ ] Build dashboard layout
- [ ] Build document upload component
- [ ] Build deadline tracker UI
- [ ] Build response letter editor

### Priority 4: Mobile Implementation
- [ ] Build auth screens
- [ ] Build document upload (camera + gallery)
- [ ] Build notification setup
- [ ] Build sync with web app

## 📁 Project Structure

```
amthelper/
├── web/                    # Next.js 16 frontend
│   ├── app/
│   │   ├── api/           # API routes (auth, documents, responses)
│   │   └── ...pages
│   ├── lib/
│   │   ├── supabase/      # Client + server
│   │   └── i18n/          # i18next config
│   ├── public/locales/    # Translation files (DE/RU/UK/EN)
│   └── .env.local         # Local config
│
├── mobile/                 # React Native + Expo
│   ├── app/
│   │   └── _layout.tsx    # Navigation setup
│   ├── lib/
│   │   ├── supabase/
│   │   └── i18n/
│   ├── locales/           # Translation files
│   ├── app.json           # Expo config
│   ├── eas.json           # EAS build config
│   └── .env.local
│
├── schema.sql             # Database schema
└── .gitignore             # Git config
```

## 🔑 Environment Variables

### Web (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ANTHROPIC_API_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Mobile (.env.local)
```
EXPO_PUBLIC_SUPABASE_URL=https://...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

## 🚀 Deployment Checklist

- [ ] Supabase project created + database schema deployed
- [ ] Auth keys configured (web + mobile)
- [ ] Stripe account setup (test mode)
- [ ] Claude API key active
- [ ] Web app runs on localhost:3000
- [ ] Mobile app runs in Expo
- [ ] All 4 languages display correctly
- [ ] API routes tested (auth, documents, stripe)

## 📞 Support

Week 1 goal: Make backend work → everything else builds on API routes.  
By Week 2-3: Full web UI + Claude integration.  
By Week 5-6: Mobile app feature-complete.

Current path: C:\HERMES\projects\amthelper\

---

**Last Updated:** 10.06.2026 (Week 1 Start)  
**Next Review:** 17.06.2026 (Week 2)
