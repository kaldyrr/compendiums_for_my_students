# Компендим по Node.js

Полный курс по Node.js: от установки и понимания движка до построения масштабируемых высоконагруженных систем. Материал рассчитан на разработчиков, знакомых с JavaScript, но охватывает путь от самых основ до продвинутых тем (производительность, безопасность, DevOps).

---

## 1. Что такое Node.js и где его использовать
- Node.js — серверная платформа на базе движка V8 и libuv. Предоставляет событийно-ориентированную неблокирующую модель ввода/вывода.
- Узкие места: высокие задержки при CPU-bound задачах, необходимость контролировать однопоточность event loop.
- Сценарии:
  - REST/GraphQL API, BFF.
  - Реалтайм (WebSocket, Socket.IO).
  - CLI / DevOps automation.
  - Streaming, proxy, serverless-функции.
  - SSR/SSG для фронтенда (Next.js, Nuxt, Remix).

---

## 2. Установка и инструменты
1. Скачайте LTS версию Node (18/20) с nodejs.org или установите через менеджеры:
   - Windows: nvm-windows / fnm.
   - macOS/Linux: `nvm`, `fnm`, `asdf`, `brew install node`.
2. Проверьте:
   ```bash
   node -v
   npm -v
   corepack enable # включает pnpm/yarn
   ```
3. Рекомендуемые пакеты:
   - Менеджеры процессов: `pm2`, `nodemon` (dev), `tsx`.
   - Линтеры: ESLint, Prettier.
   - Тесты: Jest/Vitest.
4. IDE: VS Code (Node.js Tools), WebStorm, JetBrains Fleet.

---

## 3. Структура проекта и package.json
- `package.json` описывает метаданные, зависимости, скрипты.
  ```json
  {
    "type": "module",
    "scripts": {
      "dev": "tsx watch src/index.ts",
      "build": "tsc -p tsconfig.build.json",
      "start": "NODE_ENV=production node dist/index.js"
    },
    "engines": { "node": ">=18" }
  }
  ```
- `package-lock.json`/`pnpm-lock.yaml`: фиксация зависимостей.
- `.npmrc` — настройки npm/pnpm (registry, save-exact).
- Монорепы: pnpm workspaces, Turborepo, Nx.

---

## 4. Основы Node.js API
- Глобальные объекты: `__dirname`, `process`, `Buffer`, `global`.
- Модули:
  - CommonJS (`require`, `module.exports`).
  - ESM (`import`, `export`, `"type": "module"`).
  - Dynamic `import()` разрешён в обоих режимах.
- File system:
  ```js
  import { readFile } from "node:fs/promises";
  const config = JSON.parse(await readFile("config.json", "utf8"));
  ```
- Path/URL:
  ```js
  import { fileURLToPath } from "node:url";
  const __filename = fileURLToPath(import.meta.url);
  ```
- Events: `EventEmitter`.
- Timers: `setImmediate`, `process.nextTick`, `setTimeout`.

---

## 5. Event Loop и архитектура
- Однопоточная модель с таск-очередями (macrotask, microtask), фазами (timers, pending callbacks, idle, poll, check, close).
- CPU-bound работу выносите в:
  - Worker Threads (`node:worker_threads`).
  - child_process/fork.
  - Внешние сервисы (queue + consumers).
- Используйте `async/await`, не блокируйте поток (например, `bcrypt` → `bcryptjs`/`argon2` с async API).
- Monitors:
  - `clinic.js doctor|flame`.
  - `node --trace-event-categories`.

---

## 6. HTTP серверы и протоколы
- Встроенный `http`/`https`:
  ```js
  import http from "node:http";
  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
  });
  server.listen(3000);
  ```
- `http2` (gRPC, server push), `net` TCP-сокеты.
- HTTPS: Let's Encrypt + `node:tls`, HSTS.
- Proxy: `http-proxy`, `fast-proxy`.

---

## 7. Веб-фреймворки
- **Express** — классический минималистичный фреймворк.
- **Fastify** — быстрый, schema-based, поддержка TypeScript out of the box.
- **NestJS** — модульная архитектура, DI, декораторы.
- **Koa**, **Hapi**, **AdonisJS**, **Remix** (SSR).
- GraphQL: Apollo Server, Helix, Yoga.
- RPC: tRPC, gRPC (`@grpc/grpc-js`).

---

## 8. Слои приложения
- Routing → Controller → Service → Repository → Data source.
- DTO/Schema validation: Zod, yup, Joi, class-validator.
- Config: `dotenv`, `envalid`, `convict`.
- Error handling: централизованный middleware + logging.
- Observability: logger (Pino/Winston), metrics (Prometheus), tracing (OpenTelemetry).

---

## 9. Работа с данными
- SQL: PostgreSQL (pg, Prisma, knex), MySQL (mysql2), SQLite (better-sqlite3).
- NoSQL: MongoDB, Redis, Cassandra, Elastic.
- ORM/ODM:
  - Prisma (code-first, TS-friendly).
  - TypeORM, Sequelize, MikroORM.
  - Mongoose (Mongo).
  - Drizzle ORM (SQL, type-safe).
- Caching: Redis, Memcached, in-memory LRU (`lru-cache`), CDN edge.
- Message brokers: RabbitMQ (`amqplib`), Kafka (`kafkajs`), NATS, Redis Streams.

---

## 10. Streams и буферы
- Readable/Writable/Transform streams (backpressure).
  ```js
  import { createReadStream, createWriteStream } from "node:fs";
  import { pipeline } from "node:stream/promises";
  await pipeline(
    createReadStream("input.txt"),
    createWriteStream("output.txt")
  );
  ```
- `Buffer` для бинарных данных (`Buffer.from`, `buf.toString("base64")`).
- HTTP streaming, SSE, file uploads.
- JSONStream, csv-parser, `stream/web` (WHATWG Streams).

---

## 11. CLI и tooling
- Commander, yargs, oclif для интерфейсов командной строки.
- Интерактивность: `inquirer`, `prompts`, `ink`.
- Настройка Git hooks: Husky, lefthook.
- Скрипты DevOps: управление AWS/GCP/Azure SDK, Terraform CDK.

---

## 12. Тестирование
- Unit tests: Vitest, Jest, Ava, tap.
- Integration: Supertest, LightMyRequest (Fastify), Pactum.
- E2E: Playwright, Cypress (через API), k6 (нагрузка).
- Testcontainers для поднятия БД в Docker.
- Coverage: `c8`, `nyc`.
- Контрактные тесты: Pact (consumer/provider).

---

## 13. Безопасность
- OWASP Top 10: XSS (escape output), SQL injection (parameterized queries).
- HTTP headers: helmet, cors.
- Auth: JWT (jose), session cookies (express-session, fastify-session), OAuth.
- Secrets: dotenv, AWS Secrets Manager, Vault.
- Rate limiting: `rate-limit`, `fastify-rate-limit`, Redis leaky bucket.
- Dependency scanning: `npm audit`, `snyk`, `socket`, `pnpm audit`.
- Политики публикации npm (private registry, npm token scopes).

---

## 14. Производительность и масштабирование
- Профилирование: `clinic flame`, `0x`, `perf_hooks` (`performance.mark/measure`).
- Clustering: `node:cluster`, PM2 `pm2 start app.js -i max`, но предпочтительно горизонтальное масштабирование через контейнеры/Kubernetes.
- Load balancing: Nginx, HAProxy, AWS ALB, Kubernetes Services.
- Caching на уровнях: CDN, reverse proxy, Redis, Local LRU.
- Queue-based backpressure: BullMQ, Faktory.
- Edge computing: Cloudflare Workers, AWS Lambda@Edge.

---

## 15. DevOps и deployment
- CI (GitHub Actions):
  ```yaml
  name: node-ci
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: "pnpm"
        - run: corepack enable
        - run: pnpm install --frozen-lockfile
        - run: pnpm lint && pnpm test && pnpm build
  ```
- Docker multi-stage (см. пример из JS-гайда).
- Оркестрация: Docker Compose, Kubernetes (Helm, Kustomize), ECS/Fargate, Nomad.
- Serverless: AWS Lambda, Google Cloud Functions, Vercel, Netlify Functions.
- Observability: Prometheus/Grafana, Loki, Tempo, Sentry, Datadog, Elastic APM.

---

## 16. Архитектурные паттерны
- Monolithic vs microservices vs modular monolith.
- Domain-driven design (DDD), CQRS/Event sourcing.
- BFF (Backend For Frontend), GraphQL Federation.
- Microfrontends + Node BFF (SSR).
- Layered architecture, Clean architecture, Hexagonal (ports/adapters).
- Feature flags, A/B testing, canary releases.

---

## 17. Best practices и код-стайл
- Всегда используйте `strict mode` (в ESM включён по умолчанию).
- Логирование структурировано (JSON) + correlation IDs.
- Трассировка запросов (OpenTelemetry), метрики (histogram, counter, gauge).
- Graceful shutdown: ловите `SIGTERM`, закрывайте серверы и соединения.
  ```js
  const shutdown = () => {
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  ```
- Контролируйте окружение: `NODE_ENV`, `TZ`, `LOG_LEVEL`.
- Документируйте API (OpenAPI/Swagger, GraphQL SDL).

---

## 18. Распространённые ошибки
1. **Блокирующий код** (синхронные `fs`/`crypto`), который стопорит event loop.
2. **Утечки памяти** из-за глобальных кешей, незакрытых таймеров, listeners.
3. **Необработанные promise rejection** — включайте `process.on("unhandledRejection")`.
4. **Смешение CommonJS и ESM** без понимания различий.
5. **Отсутствие безопасности**: hard-coded secrets, отсутствие rate limit, слабые CORS настройки.
6. **Неконтролируемый рост пакетов**: следите за зависимостями, используйте `npm prune`, `pnpm dedupe`.
7. **Логика в стартовом файле** вместо модулей/слоёв.

---

## 19. Дорожная карта обучения
1. Освоить основы JavaScript (ESNext, async/await).
2. Изучить Node API (fs, path, events, streams).
3. Написать REST API на Express/Fastify с БД.
4. Добавить тесты, логирование, конфигурацию, валидацию.
5. Освоить TypeScript и DI (NestJS, modular Fastify).
6. Внедрить Redis, очереди, WebSocket, GraphQL.
7. Настроить CI/CD, Docker, мониторинг, масштабирование.
8. Изучить advanced темы: cluster, workers, performance profiling, security hardening.

---

## 20. Ресурсы
- Документация: [nodejs.org/docs](https://nodejs.org/docs/latest-v20.x/api/), [Fastify.dev](https://www.fastify.io/), [nestjs.com](https://nestjs.com/).
- Книги: *Node.js Design Patterns* (Mario Casciaro), *Professional Node.js*, *API Design Patterns*.
- Курсы: Node.js on Pluralsight, Frontend Masters, Udemy (NestJS, Fastify).
- Практика: Advent of Backend, backendmentor, katas (Exercism, HackerRank).
- Сообщества: Node.js Slack, Reddit r/node, Discord Nodeiflux, Telegram-чаты, локальные митапы.

> Node.js — мощный инструмент для построения современного backend. Следуйте лучшим практикам безопасности и архитектуры, автоматизируйте процессы и измеряйте метрики — так вы сможете создавать надёжные и масштабируемые сервисы.
