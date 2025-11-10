# Компендим по JavaScript

Расширенный путеводитель по JavaScript, охватывающий путь от самых основ до продвинутых тем фронтенд и бэкенд‑разработки. Включает настройку окружения, теорию языка, best practices, архитектуру, тестирование, перфоманс и DevOps. Рассчитан на читателя, который хочет закрыть все пробелы и понимать, как строить масштабируемые проекты.

---

## 1. Зачем изучать JavaScript
- Единственный язык, поддерживаемый всеми браузерами без дополнительных плагинов.
- Подходит для фронтенда (React, Vue, Svelte), бэкенда (Node.js, Deno), мобильных приложений (React Native), десктопа (Electron), IoT и скриптов.
- Огромная экосистема пакетов (npm) и специалистов на рынке.

---

## 2. Окружение и инструменты
1. **Node.js LTS (18+)** — движок V8 + стандартная библиотека.
2. **npm/pnpm/yarn** — менеджеры пакетов; `pnpm` быстро работает с монорепами.
3. **Редактор**: VS Code с расширениями (ESLint, Prettier, GitLens, REST Client).
4. **Браузеры**: Chrome/Edge/Firefox с DevTools, React/Vue DevTools.
5. **CLI**:
   ```bash
   node -v
   npm -v
   corepack enable    # включает pnpm и yarn, если нужно
   ```
6. **Автоматизация**: nvm/fnm/volta для управления версиями Node.

---

## 3. Структура проекта
- `package.json` — зависимости, скрипты, metadata.
- `src/` — исходники, `dist/`/`build/` — результирующий код.
- `public/` (SPA) — статические ресурсы.
- `.editorconfig`, `.eslintrc`, `.prettierrc`, `.gitignore`.
- Monorepo: pnpm workspaces, Turborepo, Nx.

---

## 4. Ядро языка: синтаксис и типы
- Типы: `number`, `string`, `boolean`, `null`, `undefined`, `bigint`, `symbol`, `object`.
- `let`, `const`, `var` (не используйте `var`).
- Шаблонные строки, деструктуризация:
  ```js
  const user = { id: 1, profile: { name: "Ann" } };
  const { profile: { name }, id = 0 } = user;
  ```
- Spread/Rest: `const merged = { ...defaults, ...overrides };`.
- Операторы:
  - Nullish coalescing `??`
  - Optional chaining `?.`
  - Logical assignment `||=`, `&&=`
- Массивы: `map`, `filter`, `reduce`, `find`, `some`, `flatMap`.
- Объекты: `Object.keys`, `Object.entries`, `structuredClone`.

---

## 5. Функции и контекст
- Декларации, функциональные выражения, стрелочные функции.
- `this`: зависит от способа вызова.
  ```js
  const counter = {
    value: 0,
    inc() {
      this.value++;
    }
  };
  const fn = counter.inc;
  fn();            // this === undefined (strict mode)
  fn.call(counter);
  ```
- Замыкания: функция запоминает окружение.
- Currying и partial application для композиции.

---

## 6. Объектная модель и прототипы
- Прототипное наследование: `Object.create(proto)`.
- Классы (ES2015+):
  ```js
  class User {
    static of(data) { return new User(data.name); }
    #secret = 42;
    constructor(name) { this.name = name; }
    greet() { return `Hi, ${this.name}`; }
  }
  ```
- `extends`, `super`, приватные поля `#field`, статические блоки.
- Миксины, композиция вместо наследования.

---

## 7. Модули
- **ESM**:
  ```js
  export function sum(a, b) { return a + b; }
  export default class MathLib {}
  import MathLib, { sum } from "./math.js";
  ```
- **CommonJS**: `module.exports = { sum }`, `const { sum } = require("./math");`.
- Используйте ESM для современных проектов (`"type": "module"` в package.json) или bundler.

---

## 8. Асинхронность
- Event loop, call stack, task queue, microtasks.
- Callbacks → Promises → async/await.
  ```js
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function main() {
    await delay(1000);
    return "done";
  }
  ```
- `Promise.all`, `.allSettled`, `.any`, `.race`.
- AbortController, Streams, Web Workers.
- Обработка ошибок: `try/catch`, `promise.catch`, `unhandledrejection`.

---

## 9. Работа с браузером
- DOM API: `querySelector`, `createElement`, `dataset`.
- События: `addEventListener`, делегирование, `EventTarget`.
- Fetch API:
  ```js
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  ```
- FormData, Canvas, Web Storage, Service Workers, WebSockets.
- Accessibility, ARIA, focus management.

---

## 10. Фреймворки и библиотеки
- **React**: компоненты, hooks (`useState`, `useEffect`, `useMemo`), серверные компоненты (Next.js).
- **Vue**: Composition API, `<script setup>`, Pinia.
- **Svelte**, **Solid.js** — реактивность на уровне компиляции.
- **State management**: Redux Toolkit, Zustand, MobX, XState.
- **Styling**: CSS Modules, Tailwind CSS, CSS-in-JS (emotion, styled-components).
- **Routing**: React Router, Next.js App Router, TanStack Router.

---

## 11. Node.js и серверная разработка
- Модули: `fs`, `path`, `http`, `events`, `stream`.
  ```js
  import { readFile } from "node:fs/promises";
  const config = JSON.parse(await readFile("./config.json", "utf8"));
  ```
- Express, Fastify, NestJS, Hono.
- БД: Prisma, Sequelize, TypeORM, Mongoose, Drizzle ORM, knex.
- Потоки и буферы: backpressure, pipeline (`stream/promises`).
- CLI: Commander, yargs, oclif.
- Background jobs: BullMQ, Agenda.
- Деплой: PM2, Docker, serverless (AWS Lambda, Cloudflare Workers).

---

## 12. Type checking и качество кода
- **TypeScript** — рекомендуемый способ статической проверки. Если остаётесь на JS:
  - JSDoc аннотации `/** @type {import("./types").User} */`.
  - `// @ts-check` + `tsconfig.json`.
- ESLint + `@typescript-eslint`, Prettier, Stylelint.
- Husky + lint-staged для pre-commit.
- Commitlint + Conventional Commits.

---

## 13. Тестирование
- Unit: Vitest, Jest, Mocha + Chai.
- Component tests: Testing Library, Cypress Component, Playwright CT.
- E2E: Playwright, Cypress, WebdriverIO.
- Contract tests: Pact.
- Mocks: `vi.fn`, `nock` для HTTP.
- Coverage: `vitest --coverage`, `nyc`.
- Visual regression: Percy, Chromatic.

---

## 14. Сборка и bundlers
- Vite (esbuild + Rollup), webpack, Parcel, Snowpack.
- Build targets: modern browsers, legacy bundles (Babel, core-js).
- Tree shaking, code splitting, dynamic import.
- Transpilers: Babel, SWC, esbuild.
- CSS tooling: PostCSS, autoprefixer.
- Lerna/Turborepo/Nx для монореп.

---

## 15. Архитектура и паттерны
- Clean Architecture, Hexagonal, Feature-Sliced Design (FSD) для фронта.
- SOLID, DRY, KISS, YAGNI.
- Модульность: packages, shared libraries, design systems.
- API слои: REST, GraphQL (Apollo, urql), tRPC.
- Event-driven архитектуры, CQRS, Saga/Orchestration.
- Документация: Storybook, Ladle, Swagger/OpenAPI.

---

## 16. Безопасность
- XSS: escape, Content Security Policy, Trusted Types.
- CSRF: SameSite cookies, CSRF tokens.
- Clickjacking: `X-Frame-Options`, CSP frame-ancestors.
- Auth: OAuth/OIDC, JWT, session cookies, WebAuthn.
- Rate limiting, input validation (Zod, joi, yup).
- npm hygiene: проверка зависимостей (npm audit, snyk, socket).
- Secure headers (helmet), TLS, secret management.

---

## 17. Производительность
- Lighthouse, Web Vitals (CLS, LCP, FID, INP).
- Bundle анализ: `source-map-explorer`, `webpack-bundle-analyzer`.
- Lazy loading, priority hints, prefetch/preload.
- Memoization (`useMemo`, `React.memo`, `memoize-one`).
- Virtual DOM оптимизации, signals (Solid, Preact Signals).
- Server-Side Rendering (Next.js, Nuxt), Static Generation.
- Node.js perf: `clinic.js`, `0x`, `node --prof`.

---

## 18. DevOps и CI/CD
- GitHub Actions/GitLab CI: `npm ci`, `npm test`, `npm run build`.
- Docker multi-stage:
  ```dockerfile
  FROM node:20-alpine AS deps
  WORKDIR /app
  COPY package.json pnpm-lock.yaml ./
  RUN corepack enable && pnpm install --frozen-lockfile

  FROM node:20-alpine AS build
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  RUN pnpm build

  FROM node:20-alpine AS runtime
  WORKDIR /app
  ENV NODE_ENV=production
  COPY --from=build /app/dist ./dist
  EXPOSE 3000
  CMD ["node","dist/server.js"]
  ```
- Deployment targets: Vercel, Netlify, Cloudflare Pages, AWS/GCP/Azure.
- Observability: OpenTelemetry, Sentry, Datadog, Grafana, Prometheus.

---

## 19. Инструменты разработчика
- Chrome DevTools: Network, Performance, Coverage, Recorder.
- React DevTools, Vue DevTools, Redux DevTools.
- Postman/Insomnia/Bruno для API.
- Figma/Storybook для UI.
- Swagger UI, GraphiQL.
- Error monitoring: Sentry, Bugsnag, LogRocket.

---

## 20. Дорожная карта обучения
1. **Основы**: синтаксис, типы, функции, массивы/объекты.
2. **Браузер**: DOM, события, Fetch, Storage.
3. **Асинхронность**: Promises, async/await, event loop.
4. **Фреймворк**: выберите React/Vue/Svelte, освоите state management.
5. **Node.js**: HTTP сервер, БД, REST/GraphQL.
6. **Тестирование и качество**: ESLint, Vitest/Jest, Cypress, Storybook.
7. **Построение инфраструктуры**: bundlers, CI/CD, Docker, мониторинг.
8. **Продвинутые темы**: SSR/SSG, микрофронтенды, WebAssembly, WebGL, performance optimization.

---

## 21. Ресурсы
- Документация: [developer.mozilla.org](https://developer.mozilla.org/), [nodejs.org/docs](https://nodejs.org/docs/), [javascript.info](https://javascript.info/).
- Книги: *You Don't Know JS Yet*, *JavaScript: The Definitive Guide*, *Eloquent JavaScript*.
- Курсы: Frontend Masters, Epic React, Vue Mastery, Udemy/PluralSight.
- Практика: Advent of JS, Frontend Mentor, LeetCode (JS), Codewars, Exercism.
- Сообщества: Reddit r/javascript, Stack Overflow, dev.to, Хабр, локальные чаты.

> Освоение JavaScript требует постоянной практики и изучения новых API. Создавайте проекты, участвуйте в опенсорсе, автоматизируйте инфраструктуру и следите за обновлениями языка (TC39). Именно так формируется экспертный уровень.
