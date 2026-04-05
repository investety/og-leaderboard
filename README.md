# OpenGradient Leaderboard

Community leaderboard for OpenGradient Discord — live data via MEE6 API.

## Deploy на Vercel (5 хвилин, безкоштовно)

### Крок 1 — Завантаж файли
Розпакуй архів. Структура:
```
og-leaderboard/
├── api/
│   └── mee6.js        ← serverless proxy
├── public/
│   └── index.html     ← фронтенд
└── vercel.json        ← конфіг
```

### Крок 2 — GitHub
1. Зайди на https://github.com/new
2. Створи новий репозиторій (назва: `og-leaderboard`)
3. Завантаж всі файли (Upload files)

### Крок 3 — Vercel
1. Зайди на https://vercel.com
2. Sign up через GitHub (безкоштовно)
3. "Add New Project" → вибери репозиторій `og-leaderboard`
4. Framework Preset: **Other**
5. Output Directory: `public`
6. Натисни **Deploy**

Через 1-2 хвилини отримаєш посилання типу `og-leaderboard.vercel.app`

## Як працює

- `/api/mee6?page=0` — serverless функція проксіює MEE6 API
- `public/index.html` — фронтенд тягне дані через власний API
- Автоматично завантажує до 1000 учасників (10 сторінок)

## Guild ID
Зараз налаштований на сервер OpenGradient: `1132794141403791483`
Щоб змінити — відредагуй `api/mee6.js`, рядок `const GUILD_ID = '...'`
