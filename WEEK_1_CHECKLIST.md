# 🚀 НЕДЕЛЯ 1 — ИНФРА + МНОГОЯЗЫЧНОСТЬ + МОБАЙЛ SKELETON

**Дата:** 09.06.2026 - 15.06.2026  
**Цель:** Готовая инфра на Vercel, многоязычность setup, Expo skeleton, первый deploy

---

## ✅ CHECKLIST НЕДЕЛЯ 1

### **ДЕНЬ 1-2: SETUP ПРОЕКТА**

#### [ ] Fix Next.js версия (16.2.7 → 15.1.x)
```bash
cd C:\HERMES\projects\amthelper
npm install next@15.1.0 react@19 react-dom@19
npm install @supabase/supabase-js stripe @anthropic-ai/sdk resend
npm install next-i18next i18next
npm install -D @types/node @types/react typescript
```

#### [ ] GitHub repo + основная структура
```bash
git init
git remote add origin https://github.com/your-username/amthelper.git
git add .
git commit -m "Initial commit: Next.js 15.1.x setup"
git push -u origin main
```

#### [ ] GitHub Actions CI/CD (базовый)
Создать `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

#### [ ] Environment файлы
Создать `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=placeholder
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
SUPABASE_SERVICE_ROLE_KEY=placeholder

ANTHROPIC_API_KEY=placeholder
STRIPE_PUBLIC_KEY=placeholder
STRIPE_SECRET_KEY=placeholder
RESEND_API_KEY=placeholder
```

---

### **ДЕНЬ 2-3: SUPABASE SETUP**

#### [ ] Create Supabase project
1. Перейти на supabase.com
2. Create new project (amthelper, EU region)
3. Copy URL и ANON_KEY в .env.local

#### [ ] Database schema (SQL)
```sql
-- USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  language_preference TEXT DEFAULT 'DE',
  subscription_tier TEXT DEFAULT 'free',
  stripe_customer_id TEXT NULLABLE
);

-- DOCUMENTS
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  upload_date TIMESTAMP DEFAULT now(),
  analyzed_data JSONB NULLABLE,
  document_type TEXT NULLABLE,
  extracted_deadline DATE NULLABLE,
  sender TEXT NULLABLE,
  summary TEXT NULLABLE
);

-- LETTERS
CREATE TABLE letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  document_id UUID NULLABLE REFERENCES documents(id),
  template_id UUID NULLABLE,
  generated_text TEXT NOT NULL,
  edited_text TEXT NULLABLE,
  created_at TIMESTAMP DEFAULT now()
);

-- TEMPLATES
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content_de TEXT NOT NULL,
  difficulty TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- REMINDERS
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  document_id UUID REFERENCES documents(id),
  deadline DATE NOT NULL,
  reminder_type TEXT,
  scheduled_for TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id),
  stripe_subscription_id TEXT UNIQUE,
  current_tier TEXT,
  status TEXT,
  started_at TIMESTAMP,
  ended_at TIMESTAMP NULLABLE
);

-- RLS POLICIES (Row Level Security)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only see own letters" ON letters
  FOR SELECT USING (auth.uid() = user_id);

-- (и так далее для остальных таблиц)
```

#### [ ] Enable Authentication
1. Supabase dashboard → Authentication → Providers
2. Enable Email provider
3. Configure Redirect URL: `http://localhost:3000/auth/callback` (dev), `https://amthelper.de/auth/callback` (prod)

#### [ ] Setup Storage bucket
```bash
Supabase → Storage → Create bucket "documents"
Set to Public (для simplicity, later restrict via RLS)
```

---

### **ДЕНЬ 3-4: МНОГОЯЗЫЧНОСТЬ (next-i18next)**

#### [ ] Install and configure next-i18next
```bash
npm install next-i18next i18next
```

#### [ ] Create translation files structure
```
public/
├── locales/
│   ├── de/
│   │   └── common.json
│   ├── ru/
│   │   └── common.json
│   ├── uk/
│   │   └── common.json
│   └── en/
│       └── common.json
```

#### [ ] public/locales/de/common.json (German)
```json
{
  "app_name": "AmtHelper",
  "upload_document": "Dokument hochladen",
  "analyze": "Analysieren",
  "deadline": "Fälligkeitsdatum",
  "checklist": "Checkliste",
  "generate_letter": "Brief generieren",
  "nav": {
    "dashboard": "Dashboard",
    "documents": "Dokumente",
    "settings": "Einstellungen"
  }
}
```

#### [ ] public/locales/ru/common.json (Russian)
```json
{
  "app_name": "AmtHelper",
  "upload_document": "Загрузить документ",
  "analyze": "Анализировать",
  "deadline": "Срок ответа",
  "checklist": "Чеклист",
  "generate_letter": "Сгенерировать письмо",
  "nav": {
    "dashboard": "Панель управления",
    "documents": "Документы",
    "settings": "Настройки"
  }
}
```

#### [ ] public/locales/uk/common.json (Ukrainian)
```json
{
  "app_name": "AmtHelper",
  "upload_document": "Завантажити документ",
  "analyze": "Проаналізувати",
  "deadline": "Термін виконання",
  "checklist": "Контрольний список",
  "generate_letter": "Генерувати лист",
  "nav": {
    "dashboard": "Панель управління",
    "documents": "Документи",
    "settings": "Параметри"
  }
}
```

#### [ ] public/locales/en/common.json (English)
```json
{
  "app_name": "AmtHelper",
  "upload_document": "Upload Document",
  "analyze": "Analyze",
  "deadline": "Deadline",
  "checklist": "Checklist",
  "generate_letter": "Generate Letter",
  "nav": {
    "dashboard": "Dashboard",
    "documents": "Documents",
    "settings": "Settings"
  }
}
```

#### [ ] next-i18next.config.js
```javascript
const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'ru', 'uk', 'en'],
  },
  localePath: path.resolve('./public/locales'),
  ns: ['common'],
  defaultNS: 'common',
};
```

#### [ ] next.config.js integration
```javascript
const { i18n } = require('./next-i18next.config.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  typescript: {
    tschecked: true,
  },
};

module.exports = nextConfig;
```

#### [ ] Create Language Selector component
`components/LanguageSelector.tsx`:
```typescript
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export function LanguageSelector() {
  const router = useRouter();
  const { t } = useTranslation('common');
  
  const handleLanguageChange = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  return (
    <select 
      onChange={(e) => handleLanguageChange(e.target.value)}
      value={router.locale}
      className="p-2 border rounded"
    >
      <option value="de">Deutsch</option>
      <option value="ru">Русский</option>
      <option value="uk">Українська</option>
      <option value="en">English</option>
    </select>
  );
}
```

---

### **ДЕНЬ 4-5: EXPO MOBILE SKELETON**

#### [ ] Initialize Expo project
```bash
cd C:\HERMES\projects
expo init amthelper-mobile --template --typescript
cd amthelper-mobile
npm install
```

#### [ ] Install dependencies
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install @supabase/supabase-js
npm install i18n-js
npm install expo-camera expo-notifications
npm install expo-file-system expo-document-picker
```

#### [ ] Basic app structure (app.json)
```json
{
  "expo": {
    "name": "AmtHelper",
    "slug": "amthelper",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "plugins": [
      [
        "expo-notifications",
        {
          "sounds": ["default"]
        }
      ]
    ],
    "extra": {
      "supabaseUrl": process.env.NEXT_PUBLIC_SUPABASE_URL,
      "supabaseKey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
  }
}
```

#### [ ] Create basic navigation (App.tsx)
```typescript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={DashboardStack} />
        <Tab.Screen name="Documents" component={DocumentsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

#### [ ] Setup i18n for mobile
`i18n.config.ts`:
```typescript
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

const translations = {
  de: require('./locales/de.json'),
  ru: require('./locales/ru.json'),
  uk: require('./locales/uk.json'),
  en: require('./locales/en.json'),
};

i18n.translations = translations;
i18n.locale = Localization.locale.split('-')[0];
i18n.enableFallback = true;

export default i18n;
```

---

### **ДЕНЬ 5: VERCEL DEPLOY (TEST)**

#### [ ] Connect GitHub to Vercel
1. Перейти на vercel.com
2. Import project from GitHub (amthelper repo)
3. Configure environment variables (SUPABASE_URL, etc.)
4. Deploy

#### [ ] Test deployment
```bash
# Check Vercel logs
npm run build  # Local test
npm run start  # Test production build
```

#### [ ] Verify basic connectivity
1. Vercel URL should load Next.js app
2. Environment variables should be set
3. No errors in Vercel dashboard

---

## 📊 МЕТРИКИ УСПЕХА (конец недели 1)

✅ **ИНФРА:**
- [ ] Next.js 15.1.x установлен и работает локально
- [ ] GitHub repo создан, CI/CD работает (lint + build)
- [ ] Supabase project live, database schema готов
- [ ] Vercel deployment active (test environment)

✅ **МНОГОЯЗЫЧНОСТЬ:**
- [ ] next-i18next configured и работает
- [ ] 4 языка (DE/RU/UK/EN) готовы
- [ ] Language Selector компонент работает
- [ ] Переводы переключаются без перезагрузки

✅ **МОБАЙЛ:**
- [ ] Expo project created
- [ ] Basic navigation (Tab + Stack)
- [ ] i18n configured for mobile
- [ ] Компилируется на локальной машине

✅ **CONNECTIVITY:**
- [ ] Web app подключается к Supabase
- [ ] Mobile app может импортировать Supabase SDK
- [ ] API routes skeleton ready (/api/*)

---

## 🎯 NEXT: НЕДЕЛЯ 2

Когда неделя 1 готова:
- [ ] Backend сервисы (Anthropic, Stripe, Resend)
- [ ] Суpabase API интеграция
- [ ] Первый успешный API call (web → Supabase)
- [ ] Mobile: shared API client

---

**Статус:** READY FOR WEEK 1  
**Начинаем:** 09.06.2026  
**Финиш:** 15.06.2026
