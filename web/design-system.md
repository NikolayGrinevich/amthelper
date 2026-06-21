# AmtHelper Design System v1.0

_Date: 2026-06-19_  
_Audience: Russian/Ukrainian/Romanian immigrants in Germany, 35–55 y.o._  
_Context: stress-heavy bureaucracy, official but friendly_

---

## 1. Colors (light theme only)

### Brand

| Role | HEX | Usage |
|---|---|---|
| Primary | `#2563A8` | Main CTAs, active nav, focus states |
| Primary Hover | `#1A4B8C` | Hover / active press |
| Secondary | `#4B6B8D` | Secondary buttons, subtitles, icons |

### Semantic

| State | HEX | Background | Text |
|---|---|---|---|
| Success | `#2E7D4F` | `#ECFDF5` | `#065F46` |
| Warning | `#D97706` | `#FFFBEB` | `#92400E` |
| Danger | `#C43E3E` | `#FEF2F2` | `#991B1B` |

### Neutrals

| Role | HEX |
|---|---|
| Background | `#F6F8FB` |
| Surface | `#FFFFFF` |
| Border | `#E2E8F0` |
| Text Primary | `#1A202C` |
| Text Secondary | `#64748B` |

---

## 2. Typography

### Fonts

- **Headings + Body**: `Inter` (400, 500, 600, 700)
- **Fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

### Scale

| Level | Size | Line-height | Spacing | Use |
|---|---|---|---|---|
| H1 | 32px | 40px | -0.02em | Page title |
| H2 | 24px | 32px | -0.01em | Section title |
| H3 | 18px | 26px | 0 | Card title |
| H4 | 16px | 22px | 0 | Label / field |
| Body | 15px | 24px | 0 | Main text |
| Caption | 13px | 18px | +0.01em | Hints, metadata |

### Rules

- Min contrast **4.5:1** (WCAG AA)
- Max line length **65–75 chars**
- Paragraph spacing **16px**

---

## 3. Web Components

### 3.1 Document Card

```
┌─────────────────────────────────────┐
│ 📄                         [Срочно ▼] │
│                                      │
│ Finanzamt — Steuerbescheid 2024      │
│ Frist: 15.11.2024                    │
│ Dringlichkeit: Hoch                  │
│                                      │
│ [Antwort erstellen]  [Details]       │
└─────────────────────────────────────┘
```

- **Padding**: 16px  
- **Radius**: 12px  
- **Border**: 1px solid `#E2E8F0`  
- **Shadow**: `0 1px 3px rgba(0,0,0,0.04)`  
- **Hover shadow**: `0 4px 12px rgba(0,0,0,0.06)`

### 3.2 Buttons

| Type | Height | Radius | Text | Colors |
|---|---|---|---|---|
| Primary | 48px | 10px | 15px/500 #FFF | BG `#2563A8`, hover `#1A4B8C` |
| Secondary | 44px | 10px | 15px/500 `#4B6B8D` | BG `#FFF`, border `#E2E8F0` |
| Danger | 48px | 10px | 15px/500 #FFF | BG `#C43E3E` |

- **Padding X**: 24px  
- **Transition**: `background-color 150ms ease, box-shadow 150ms ease`

### 3.3 Status Badges

| Status | BG | Text | Border |
|---|---|---|---|
| Срочно | `#FEF2F2` | `#991B1B` | `#FECACA` |
| Важно | `#FFFBEB` | `#92400E` | `#FDE68A` |
| Выполнено | `#ECFDF5` | `#065F46` | `#A7F3D0` |

- **Radius**: 9999px (pill)  
- **Padding**: 4px 12px  
- **Font**: 13px/500

### 3.4 Progress Bar

```
████████████████░░░░░░░░  67%
```

- **Height**: 6px  
- **Track**: `#E2E8F0`  
- **Fill**: `#2563A8`  
- **Radius**: 3px  
- **Animation**: `ease-out 300ms`

### 3.5 Sidebar Navigation (web)

```
┌──────────────────────┐
│ ● AmtHelper          │  — logo, 18px/700
├──────────────────────┤
│ 📄  Анализ           │
│ 📝  Письма           │
│ 📋  Шаблоны          │
│ 📅  Дедлайны         │
│ ⚙  Настройки        │
└──────────────────────┘
```

- **Width**: 260px  
- **Item height**: 44px  
- **Active**: `bg-blue-50 text-blue-700`  
- **Inactive**: `text-gray-600`  
- **Icon size**: 20px, gap 12px

---

## 4. Mobile (Expo)

### 4.1 Bottom Navigation

```
┌─────────────────────────────┐
│                             │
│         Content             │
│                             │
├─────────────────────────────┤
│ 📄   📝   📋   📅   ⚙      │
│ Анализ Письма Шаблоны Ещё   │
└─────────────────────────────┘
```

- **Height**: 64px  
- **Icon**: 24px  
- **Label**: 11px/500  
- **Active**: `#2563A8`  
- **Inactive**: `#94A3B8`  
- **Top border**: 1px solid `#E2E8F0`

### 4.2 Home Screen

```
┌─────────────────────────────┐
│ [≡]  AmtHelper           [👤] │  — 56px header
├─────────────────────────────┤
│ Привет, пользователь         │  — H2, 24px
│                              │
│ ┌─────────────────────────┐  │
│ │ 📊 Последний анализ     │  │ — rounded-2xl, p-4
│ │ Finanzamt, 15.11        │  │
│ │ [Создать ответ]         │  │
│ └─────────────────────────┘  │
│                              │
│ Быстрые действия:            │
│ ┌──────┐ ┌──────┐ ┌──────┐  │
│ │ 📄   │ │ 📝   │ │ 📋   │  │ — 80x80
│ │Анализ│ │Письма│ │Шабл. │  │
│ └──────┘ └──────┘ └──────┘  │
│                              │
│ 📅 Ближайшие дедлайны        │
│ • 15.11 — Steuerbescheid    │
│ • 22.11 — Aufenthalt        │
│                              │
├─────────────────────────────┤
│ 📄   📝   📋   📅   ⚙      │
└─────────────────────────────┘
```

### 4.3 Touch & Spacing

- **Horizontal padding**: 16px  
- **Vertical gap**: 16px between sections  
- **Card gap**: 12px  
- **Button min-height**: 48px  
- **Input height**: 52px  
- **Min touch target**: **44×44px** for all interactive elements

---

## 5. UX Principles

### 1. Official but warm
- Background `#F6F8FB` instead of pure white — softer on eyes  
- Inter font: modern, neutral, highly legible  
- Emoji icons in templates reduce anxiety

### 2. Don’t panic users in stress
- Use **Danger** only for objective threats ( missed deadline, rejection )  
- **Warning** for soft alerts ( deadline in 3 days )  
- No `!` in button labels  
- Every error includes **next step**, not just “what went wrong”

**Bad:**  
`❌ ОШИБКА! Файл не загружен!`

**Good:**  
`Файл не загружен. Проверьте формат (PDF до 10MB) и попробуйте снова.`

### 3. No technical jargon
- Translate all Amt terms: `Bescheid` → `Решение/Письмо`  
- Every action has immediate visible feedback  
- Max 5 items in main nav  
- Back button always top-left on mobile

---

## 6. Patterns

### Empty State

```
         📋

  Пока нет документов

  [Загрузить первый файл]
```

- Centered  
- Icon 64px, `#CBD5E1`  
- Text: `Text Secondary`  
- CTA: Secondary button

### Skeleton Loading

```
┌─────────────────────────────┐
│ ████████░░░░░░░░           │  — 6px, pulse
│ ████░░░░░░░░░░░░           │
│ ██████████░░░░░░           │
└─────────────────────────────┘
```

- Track: `#F1F5F9`  
- Animation: `pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite`

### Toast

```
                    ┌──────────────────────────┐
                    │ ✓ Документ сохранён      │
                    └──────────────────────────┘
```

- **Web**: fixed `bottom-6 right-6`  
- **Mobile**: fixed `bottom-20 center`  
- BG: `#1A202C`, Text: `#FFFFFF`  
- Radius: 8px, padding 12px 16px  
- Shadow: `0 4px 12px rgba(0,0,0,0.15)`  
- Auto-hide: 3s

---

_Ready to implement._
