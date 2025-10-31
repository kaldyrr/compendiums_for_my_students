# Полный гид по Docker и Docker Compose

Этот документ поможет новичку уверенно работать с контейнерами: от установки Docker до построения окружений разработки и CI/CD. Включены инструкции для Windows, macOS, Linux, примеры команд и best practices.

---

## 1. Зачем нужны контейнеры
- **Контейнер** — изолированная среда с приложением и его зависимостями. Работает поверх ядра ОС (Linux) и повторяемо переносится между машинами.
- **Изображение (image)** — шаблон, из которого создаётся контейнер. Содержит файловую систему и метаданные.
- **Registry** — хранилище образов (Docker Hub, GitHub Container Registry, GitLab, AWS ECR, Azure ACR).
- **Compose** — инструмент для описания мультиконтейнерного окружения (`docker-compose.yml`), удобен для локальной разработки и тестов.

---

## 2. Установка и проверка
### 2.1 Windows
1. Установите [Docker Desktop](https://www.docker.com/products/docker-desktop/). Для Windows 10/11 Pro требуется включить Hyper-V или WSL2, для Home — обязательно WSL2.
2. В настройках включите **Use the WSL2 based engine**.
3. После установки выполните в PowerShell:
   ```powershell
   docker --version
   docker compose version
   docker run --rm hello-world
   ```
   При успехе Docker скачает образ `hello-world` и выведет приветствие.

### 2.2 macOS
1. Установите Docker Desktop (для чипов x86 и Apple Silicon есть отдельные сборки).
2. Проверка идентична: `docker --version`, `docker run hello-world`.

### 2.3 Linux (пример: Ubuntu)
```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --batch --yes --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```
Выйдите из сессии или выполните `newgrp docker`, затем `docker run hello-world`.

---

## 3. Как устроены контейнеры
- **Слойность**: образ состоит из слоёв (layer). Каждый слой — неизменяемый snapshot. При сборке слои кешируются.
- **Union filesystem**: runtime создаёт поверх слоёв дополнительный «записываемый» слой (container layer), который удаляется при удалении контейнера.
- **Namespaces и cgroups**: Docker использует Linux namespaces (PID, NET, IPC, MNT, UTS, USER) для изоляции и cgroups для ограничения ресурсов.
- **Image ID и tags**: идентификатор (`sha256:...`) и теги (`1.0.0`, `latest`). Тег — человекочитаемый указатель на слоя.

---

## 4. Базовые команды Docker CLI
```bash
docker version                # сведения о клиенте и демоне
docker info                   # статистика по движку

docker pull nginx:1.27        # скачивание образа
docker images                 # список локальных образов
docker rmi <image>            # удаление образа

docker run -it ubuntu:24.04 /bin/bash   # запуск интерактивного контейнера
docker run --rm -d -p 8080:80 nginx     # run + detach + проброс порта

docker ps                      # список работающих контейнеров
docker ps -a                   # включая остановленные
docker stop <container>        # остановка
docker rm <container>          # удаление

docker logs -f <container>     # просмотр логов
docker exec -it <container> sh # выполнение команды внутри контейнера

docker inspect <container>     # подробная информация (JSON)
docker stats                   # мониторинг ресурсов
```

---

## 5. Dockerfile: структура и best practices
```dockerfile
# 1. Выбор базы
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2. Сборка front-end
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Минимальный runtime
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Рекомендации
1. **Минимизируйте слои**: комбинируйте команды `RUN` с `&&` и очищайте кеш пакетов (`apt-get clean`).
2. **.dockerignore** — исключайте `node_modules`, `bin`, `obj`, `.git`, `tests/.coverage`.
3. **Multi-stage build** — основной способ уменьшить итоговый образ (исходники, dev-зависимости удаляются).
4. **Не запускайте от root**: `USER` или `--user` в `docker run`. В Linux-праймерах указывайте UID/GID.
5. **ENV и ARG**: `ARG` используется на этапе сборки, `ENV` остаётся в образе.
6. **HEALTHCHECK** — мониторинг состояния:
   ```dockerfile
   HEALTHCHECK CMD curl --fail http://localhost:8080/health || exit 1
   ```
7. **ENTRYPOINT vs CMD**: ENTRYPOINT — основная команда, CMD — аргументы по умолчанию. Для утилит `ENTRYPOINT ["program"]`, для приложений часто достаточно `CMD`.

---

## 6. Работа с образами и регистрами
- Авторизация: `docker login <registry>` (например, `docker login ghcr.io`).
- Теги: `docker tag app:latest ghcr.io/user/app:1.0.0`.
- Публикация: `docker push ghcr.io/user/app:1.0.0`.
- Удаление старых образов: `docker image prune`, `docker builder prune`.
- Автоматизация версий: SemVer (`major.minor.patch`), используйте Git‑sha в дополнительных тегах (`v1.2.3-<commit>`).

---

## 7. Docker Compose: мультиконтейнерная разработка
```yaml
# docker-compose.yml
version: "3.9"
services:
  api:
    build: ./services/api
    ports:
      - "8080:8080"
    env_file:
      - ./services/api/.env.development
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./services/api/src:/app/src
      - m2-cache:/root/.m2
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: localpass
      POSTGRES_DB: app
    volumes:
      - pg-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 10
volumes:
  pg-data:
  m2-cache:
```

### Типичные сценарии
- `docker compose up -d` — поднять окружение, `logs -f` — поток логов, `ps` — статус.
- `docker compose down` — остановить, `down -v` — удалить и данные (volumes).
- Override для dev: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up`.
- Профили: используйте `profiles` для включения/выключения сервисов (`docker compose --profile tests up`).

---

## 8. Тома, сети и параметры запуска
- **Volumes**: сохраняют данные между перезапусками. Локальные (`docker volume create data`), bind mount (`./logs:/app/logs`), tmpfs.
- **Networks**: изолируют сервисы. По умолчанию Compose создаёт сеть `<project>_default`. Можно создавать custom сети (`docker network create`). Внутри контейнеры видят друг друга по имени сервиса.
- **Порты**: `1234:80` — хост:контейнер. Не публикуйте чувствительные сервисы наружу (используйте reverse proxy).
- Ограничения ресурсов: `--cpus 1.0`, `--memory 512m`, `--gpus all` (для GPU).

---

## 9. Dev vs Prod
- **Dev**:
  - Громоздские базовые образы допустимы (для скорости сборки).
  - Используйте bind mounts для кода (`./src:/app/src`), включайте hot reload (например, `dotnet watch`, `npm run dev`).
  - Логи чаще оставляйте в stdout для просмотра через `docker compose logs`.
- **Prod**:
  - Минимизируйте поверхность атаки: distroless, `alpine`, `scratch`.
  - DVС (Digital signature) и контроль версий образов, сканирование уязвимостей (Trivy, Grype).
  - Включите `--pull` при сборке, чтобы получать свежие базовые слои.
  - Конфигурации через env (12-factor). Секреты — через секрет‑менеджеры (Vault, AWS Secrets Manager, Docker secrets).

---

## 10. Отладка и диагностика
- `docker logs -f` — поток логов, `--tail 100` — только последние строки.
- `docker inspect` — метаданные, IP, mounts, переменные окружения.
- `docker exec -it` — «подключиться» к контейнеру для диагностики (`sh`, `bash`, `powershell`).
- `docker top` — процессы внутри контейнера.
- `docker events` — события демона, полезно при поиске проблем с запуском.
- `docker system df` — использование диска. Очистка: `docker system prune` (осторожно: удаляет всё неиспользуемое).
- В Linux используйте `journalctl -u docker.service` для просмотра логов демона.

---

## 11. Безопасность
- Запускайте контейнеры от несистемного пользователя (`USER app`).
- Ограничивайте capabilities (`--cap-drop ALL`, `--cap-add NET_BIND_SERVICE`).
- Не храните секреты в образе: используйте переменные окружения, Docker secrets, `--env-file`.
- Подписывайте образы (Docker Content Trust, cosign).
- Регулярно сканируйте образы (`trivy image`, `docker scout`).
- Используйте минимальные базовые образы и обновляйте пакеты (`apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*`).

---

## 12. Интеграция с CI/CD
Пример GitHub Actions:
```yaml
name: build-and-push
on:
  push:
    branches: [ main ]
jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-qemu-action@v3        # мультиархитектурные билды
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
          platforms: linux/amd64,linux/arm64
          cache-from: type=gha
          cache-to: type=gha,mode=max
```
- Включайте `docker compose config` для проверки синтаксиса.
- Используйте `docker buildx bake` для продвинутых сценариев (matrix builds, кэширование).

---

## 13. Логи, мониторинг, алертинг
- Перенаправляйте логи в stdout/stderr, чтобы их подхватывали агрегаторы (ELK/EFK, Loki, Datadog).
- Для структурированных логов настройте JSON-формат (`ENV Logging__Console__FormatterName=Json` в .NET).
- Мониторинг: `cadvisor`, `node_exporter`, `prometheus`. В Kubernetes — встроенные метрики через kube-state-metrics.
- Используйте healthchecks и системные пробки (readiness/liveness). Для Compose — `healthcheck`, для Kubernetes — `readinessProbe`.

---

## 14. Типичные ошибки и как их избежать
1. **`latest` в продакшне** — неожиданные обновления. Фиксируйте версии базовых образов и зависимостей.
2. **Сборка из `root` проекта** без `.dockerignore` — в образ попадает мусор (.git, node_modules, secrets). Создайте `.dockerignore`.
3. **Проброс 0.0.0.0:3306** для баз данных — случайно открываете сервис наружу. Используйте внутренние сети и VPN.
4. **Множественные `FROM` без multi-stage** — не удаляются dev-зависимости. Применяйте multi-stage.
5. **Отсутствие перезапуска** — используйте `restart: unless-stopped` либо оркестратор (Swarm, Kubernetes).
6. **Ошибки прав доступа на volume** — выравнивайте UID/GID, проверяйте контексты SELinux/AppArmor.

---

## 15. Расширенные темы
- **BuildKit** — современный движок сборки: параллельная загрузка, кэширование, секреты (`docker build --secret id=MY_SECRET,src=secret.txt`).
- **Dev Containers** — VS Code Remote Containers (`.devcontainer/devcontainer.json`) для одинаковой среды разработки.
- **Docker Swarm** — простой оркестратор с декларативными стеками (`docker stack deploy`).
- **Kubernetes** — де-факто стандарт для продакшн-оркестрации. Docker — один из способов собрать контейнеры.
- **Rootless Docker** — запуск демона без root (повышенная безопасность).

---

## 16. План обучения
1. **Базовые команды**: запуск, остановка, просмотр логов.
2. **Dockerfile**: сборка собственного образа, применение `.dockerignore`.
3. **Volumes и networks**: настройка stateful сервисов (PostgreSQL, Redis).
4. **Compose**: сборка окружения из нескольких сервисов.
5. **CI/CD**: автоматический build+push, использование секретов.
6. **Security & Monitoring**: healthchecks, ограничение ресурсов, сканирование.

---

## 17. Полезные ресурсы
- Документация: [docs.docker.com](https://docs.docker.com/).
- Практика: [Play with Docker](https://labs.play-with-docker.com/), [Katacoda Labs](https://www.katacoda.com/).
- Инструменты: Trivy (безопасность), Dive (анализ слоёв образа), Portainer (UI для Docker).
- Книги и курсы: *Docker Deep Dive* (Nigel Poulton), *Using Docker* (Adrian Mouat), курсы от Kubernetes Academy.

> Освойте контейнеры локально, затем перенесите приложение в Docker Compose и подключите CI — это даст рабочее понимание контейнеризации от разработки до продакшна.
