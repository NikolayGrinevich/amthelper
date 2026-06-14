# AmtHelper — Ironclad project analysis + phased execution plan

## 1. Current verified working state (12.06)
✅ Core infra
- Next.js 14.2 app under `app/[locale]` dynamic segment.
- `i18n.config.ts`: locales `de`, `ru`, `uk`, `ro`. Default `de`.
- `middleware.ts` redirects `/` → `/de`.
- TypeScript build finishes successfully.
- Public static pages: pricing, subscription, impressum, datenschutz exist.

✅ Auth scaffold
- `app/providers/AuthProvider.tsx`.
- `app/api/auth/login`, `me`, `signup` defined.
- Auth returns 200 on GET `/api/auth/me`.

✅ i18n messages
- `messages/de/common.json`, `ru/common.json`, `uk/common.json`, `ro/common.json`.

✅ Error/loading UX
- `app/[locale]/loading.tsx`.
- `app/[locale]/error.tsx` + `app/global-error.tsx`.

✅ Stripe/Pricing
- `app/api/subscriptions/route.ts`.
- `app/[locale]/pricing/page.tsx`.
- Stripe helpers present.

✅ DSGVO legal pages
- Impressum + Datenschutz present per `i18n.config.ts`.

❌ Not functional yet
- Mobile app scaffold is absent — no RN project at all.
- Real backend integrations are stubbed (Supabase, anthropic keys not wired).
- Document analyzer client page still contains hardcoded English labels, not locale-aware.
- Dashboard/quick links still point to non-locale paths such as `/modules/document-analyzer`.
- Templates/checklist/letter-generator pages likely pending or incomplete.
- Subscription checkout flow is not end-to-end (UI exists, payment completion not verified).

## 2. Known risks
1. Hardcoded UI strings across `/dashboard`, `/modules` — RO rollout incomplete.
2. Route mismatch: no `/modules/...` routes under `[locale]/modules` confirmed.
3. EN → RO is mandatory — the repo still contains English artifacts.
4. RN mobile is mandatory before production; currently there is only the web plan.
5. API keys/auth/Supabase/Stripe are not ready for real billing.

## 3. Recommended phased plan
Decision rule: next phase unlocks only after the previous phase has a verifiable `npm run build` and a real runtime check for at least one flow.

Phase A — Stabilize web core and remove EN completely
Tasks
A1 Replace all hardcoded English strings in web UI.
A2 Verify all `/modules` routes exist with locale prefix.
A3 Ensure no EN references remain in configs/docs.
Acceptance criteria
- `npm run build` passes.
- At least one route renders correct localized text for `ru` and `ro`.

Priority: P0

Phase B — Make auth + payments work end to end
Tasks
B1 Wire real Supabase credentials (anon + service).
B2 Wire real Stripe secret + webhook secret.
B3 Make checkout redirect return to active subscription page.
Acceptance criteria
- Signup + login via Supabase works.
- `/api/subscriptions` creates customer/session and `webhook` updates status.
- UI shows user `tier` (free/paid).

Priority: P0

Phase C — Finish four module UIs
Tasks
C1 Document analyzer stays locale-aware; keep upload/AI parse UI.
C2 Deadline tracker works with dates + local reminders.
C3 Checklist with save to Supabase.
C4 Templates + letter generator with Claude generation.

Priority: P1

Phase D — Mobile scaffold and parity
Tasks
D1 Initialize Expo app.
D2 Verify `expo-router` layout + `next-intl` token logic on device.
D3 Mirror core web flows in RN (at least ticketless version is not allowed).

Priority: P1

Phase E — Beta hardening
Tasks
E1 E2E smoke script for locale switch, signup, payment trial.
E2 Error tracking/Sentry.
E3 Final legal review for DSGVO/Impressum.

Priority: P1

## 4. Next concrete step
Start with Phase A. Will patch every locale-hardcoded page next.
