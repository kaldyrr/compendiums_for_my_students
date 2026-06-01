# Архитектура интерактивной платформы для курса

Ревизия: 2026-06-01.

Цель: сразу проектировать курс как большое платное приложение, но так, чтобы первый production MVP можно было развернуть на небольшом VPS: 2 CPU core, 3.6 GHz, 10 GB free NVMe.

---

## 1. Базовая стратегия

Начинаем с modular monolith, а не с микросервисов. Это снижает расходы, упрощает деплой и оставляет нормальные границы для будущего роста.

Первый сервер держит:
- web UI;
- API;
- SQLite database;
- один runner worker;
- reverse proxy;
- cron/backup scripts.

Не держит на первом сервере:
- тяжелый ELK/Prometheus стек;
- сборку Docker-образов;
- параллельные runner-пулы;
- большие пользовательские артефакты;
- отдельный Redis, если очередь можно хранить в SQLite.

---

## 2. Runtime stack

- Frontend: React + Vite, PWA, responsive desktop/mobile UI.
- Desktop/mobile упаковка позже: Tauri для desktop, Capacitor для mobile, если PWA будет недостаточно.
- Backend: Node.js 24 LTS, Fastify или Hono.
- Database MVP: SQLite WAL.
- Reverse proxy: Caddy или Nginx.
- Auth: email/password + magic link или OAuth позже.
- Payments: provider abstraction + webhook table; конкретного провайдера выбираем отдельно.
- Content: Markdown/JSON lesson files в репозитории, импортируемые в БД при релизе.

---

## 3. Модули приложения

```text
apps/web
  Рабочая область курса: macOS-like desktop, mobile flow, PWA.

apps/api
  Auth, billing, groups, progress, content API, attempts API.

apps/runner
  Изолированное выполнение student code, тесты, diagnostics.

packages/content-schema
  Схемы уроков, блоков, заданий и проверок.

packages/generator
  Преобразует блоки конструктора в реальные файлы проекта.

packages/diagnostics
  Переводит SyntaxError/ReferenceError/test failures в учебные подсказки.

packages/ui
  Общие компоненты интерфейса.
```

---

## 4. Runner safety

Код студента нельзя выполнять в web/API процессе.

MVP runner:
- отдельный Node process;
- очередь задач в SQLite;
- `concurrency=1` по умолчанию;
- timeout 5 секунд;
- ограничение stdout/stderr;
- временная папка на каждую попытку;
- очистка после job;
- сеть выключена для обычного запуска;
- npm install только в контролируемом install step.

Следующий уровень:
- Docker container с `--network none`, memory/pids/cpu limits, read-only root;
- отдельный runner VPS;
- gVisor/Firecracker, если появятся деньги и нагрузка.

---

## 5. VPS storage budget

10 GB free NVMe быстро заканчиваются, поэтому:
- не билдим Docker images на VPS;
- не храним `node_modules` для каждой попытки;
- не сохраняем полные проекты студентов без лимита;
- не ставим Postgres + Redis + monitoring stack на первом этапе;
- включаем logrotate;
- делаем ежедневный сжатый backup SQLite;
- чистим temp runner workspace после каждой попытки.

Пример бюджета:
- app image/static/runtime: 1-2 GB;
- SQLite + WAL + backups: 1-3 GB;
- runner temp/cache: 1-2 GB;
- logs: до 500 MB;
- запас под обновления: 2-3 GB.

---

## 6. Deploy flow для приватного репозитория

Так как репозиторий приватный, VPS не должен хранить личный токен разработчика.

Предпочтительный поток:
1. GitHub Actions собирает app image.
2. Image публикуется в GHCR.
3. VPS использует read-only deploy token для `docker pull`.
4. Secrets лежат в `.env` на VPS или в secret manager, но не в Git.
5. Release = pull нового image + миграции + restart.

Альтернатива для самого раннего этапа:
- read-only deploy key;
- `git pull` на сервере;
- `npm ci --omit=dev`;
- systemd restart.

Для 10 GB NVMe предпочтительнее GitHub Actions + готовый image, потому что сборка на VPS съедает диск и CPU.

---

## 7. Процессы на VPS

Минимальный systemd-вариант:
- `caddy` или `nginx`;
- `course-api.service`;
- `course-runner.service`;
- `course-backup.timer`.

Минимальный Docker-вариант:
- `proxy`;
- `app`;
- `runner`;
- volume `course-data` для SQLite и uploads;
- bind mount `/var/backups/course`.

---

## 8. Границы масштабирования

Оставляем точки расширения заранее:
- `runner` можно вынести на отдельный сервер без переписывания UI.
- SQLite можно заменить PostgreSQL, если доступ к данным идет через repository layer.
- Browser runner остается бесплатным способом снизить нагрузку.
- Payments provider меняется через adapter.
- Content import отделен от runtime, чтобы уроки можно было версионировать.

---

## 9. Accounts, moderation, billing

- Регистрация MVP: Telegram Gateway phone verification.
- Базовый внешний пользователь получает `FREE`.
- Свои студенты получают `INTERNAL_STUDENT_MAX` через ручную выдачу или invite code.
- Admin/moderator действия пишутся в audit log.
- Платежи идут через provider adapter; первый adapter заложен под Platega.
- Доступ после оплаты выдается только после подтвержденного webhook/status.
- Для приватного репозитория платежные и Telegram secrets находятся только в runtime env, не в Git.

---

## 10. Минимальные production checks

- HTTPS включен.
- Rate limit на login, payment webhooks и runner jobs.
- Backups восстанавливаются на тестовой машине.
- Runner не имеет доступа к production secrets.
- В `.npmrc` для вузовского профиля есть `strict-ssl=false`, но production profile использует нормальный TLS.
- Healthcheck проверяет API, DB write/read и runner heartbeat.
- Админка видит очередь runner и последние ошибки.
