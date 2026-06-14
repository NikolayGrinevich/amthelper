# AmtHelper — Next.js Rules (Permanent)

## ПРАВИЛО 1 — СТРУКТУРА LAYOUTS
`<html>` и `<body>` ТОЛЬКО в корневом `app/[locale]/layout.tsx`

В `dashboard/layout.tsx`, `modules/layout.tsx` и любых вложенных layouts — **НИКАКИХ** `<html>` и `<body>`. Только содержимое.

```tsx
// app/[locale]/layout.tsx ✅
return (
  <html lang={locale} translate="no">
    <body>...</body>
  </html>
);

// app/[locale]/dashboard/layout.tsx ✅
return (
  <AuthProvider locale={locale}>
    <div style={{display:'flex', height:'100vh'}}>
      <aside>...</aside>
      <main>...</main>
    </div>
  </AuthProvider>
);
```

---

## ПРАВИЛО 2 — SSR/CSR КОМПОНЕНТЫ
В `'use client'` компонентах **запрещено в JSX напрямую**:
- ✗ `Date.now()` / `Math.random()`
- ✗ `window` / `localStorage` / `sessionStorage`
- ✗ `new Date()`

Всё это — **только внутри `useEffect`**.

```tsx
// ❌ ПЛОХО — рендерит разное на сервере и клиенте
export default function Page() {
  return <div>{Date.now()}</div>;
}

// ✅ ХОРОШО — одинаковое на сервере и клиенте
export default function Page() {
  const [time, setTime] = useState(0);
  useEffect(() => setTime(Date.now()), []);
  return <div>{time}</div>;
}
```

---

## ПРАВИЛО 3 — ЗАГРУЗОЧНЫЕ СОСТОЯНИЯ
Если компонент возвращает `null` при `loading=true` → сервер и клиент рендерят разное → **hydration crash**.

**Решение:** скелетон-заглушка **одинаковых размеров**.

```tsx
// ❌ ПЛОХО — null при загрузке
if (loading) return null;

// ✅ ХОРОШО — скелетон тех же размеров
if (loading) return (
  <div style={{width:'240px', minHeight:'100vh', background:'linear-gradient(...)'}} />
);
```

---

## ПРАВИЛО 4 — БИТЫЕ ССЫЛКИ
Перед добавлением любой `href` ссылки — **проверить что маршрут существует** в `app/[locale]/`.

```bash
ls app/[locale]/
# должно содержать: auth, dashboard, datenschutz, impressum, modules, pricing, subscription
```

Несуществующий `href` → Next.js RSC prefetch 404 → **hydration crash** (React #418/#422, NotFoundError insertBefore/removeChild).

---

## ПРАВИЛО 5 — ДИАГНОСТИКА
При hydration ошибках **СНАЧАЛА** искать:

1. **Вложенные `<html>`/`<body>` теги** — в дочерних layouts
2. **Битые `href` ссылки** — 404 в консоли на `_rsc` запросах
3. **SSR/CSR несоответствия** — `Date.now()`, `window`, `Math.random()` в render

**НЕ** добавлять error boundaries и `suppressHydrationWarning` как первый шаг — это маскирует баг, а не исправляет.

---

*Rules established: 14.06.2026 | Commit: 14d47de*