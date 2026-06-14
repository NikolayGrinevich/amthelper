# AmtHelper

Official correspondence helper for Russian-speaking users in Germany. AI-powered document analysis, deadline tracking, letter generation, and business workflow automation.

## Features

- Document Analyzer: OCR + AI analysis for German official letters
- Deadline Tracker: automatic deadline extraction and reminders
- Letter Generator: formal German response letters
- Checklist: ready-made checklists per document type
- Templates: reusable letter templates
- i18n: German, Russian, Ukrainian, Romanian
- DSGVO-ready: Datenschutzerklärung, Impressum, Cookie Banner

## Local development

```bash
cd C:\HERMES\projects\amthelper\web
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:4000

Demo credentials:
- Email: demo@amthelper.de
- Password: see .env.local

## Production deployment

- Vercel: vercel.json present. Set env vars listed in .env.example.
- EAS: eas.json present for React Native builds.
- Supabase + Stripe + Anthropic keys required.
