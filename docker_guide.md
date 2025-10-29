# Гайд по Docker и Docker Compose (практика)

С нуля до удобной локальной разработки и сборки образов для CI/CD.

## Раздел 1. Установка и проверка
- Windows/macOS: Docker Desktop (WSL2 для Windows). Linux: `apt install docker.io docker-compose-plugin`.
- Проверка: `docker --version`, `docker compose version`, `docker run hello-world`.

## Раздел 2. Базовые понятия
- Image (образ), Container (контейнер), Registry (реестр), Layer (слой), Volume (том), Network (сеть).
- Жизненный цикл: build → run → logs/exec → stop → rm.

## Раздел 3. Основные команды
```bash
docker ps -a                # контейнеры
docker images               # образы
docker network ls           # сети
docker volume ls            # тома

docker run --rm -it alpine sh      # запустить и зайти в shell

docker logs -f <name>       # логи
docker exec -it <name> sh   # войти внутрь

docker stop <name> && docker rm <name>
```

## Раздел 4. Dockerfile — основы и best practices
```dockerfile
# пример для Node.js (multi-stage)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["node","dist/main.js"]
```
- Используйте `.dockerignore` (node_modules, build‑артефакты, .git).
- Multi‑stage уменьшает размер и ускоряет запуск; фиксируйте версии базовых образов.
- Не работайте от root без необходимости (`USER node` в финальном слое, если можно).

## Раздел 5. .dockerignore (пример)
```
.git
node_modules
**/bin
**/obj
.DS_Store
.idea
.vscode
.env
```

## Раздел 6. Compose — локальная оркестрация
```yaml
# docker-compose.yml
services:
  api:
    build: ./services/api
    ports: ["8080:8080"]
    env_file: [.env]
    depends_on: [db]
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: pass
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata: {}
```
- Запуск: `docker compose up -d` и `docker compose logs -f`.
- Остановка/удаление: `docker compose down` (с `-v` для очистки томов).
- `healthcheck` и `depends_on` делают поднимание сервисов предсказуемым.

## Раздел 7. Dev и Prod режимы
- Dev: монтируйте код томом (`volumes: - ./src:/app/src`) + hot reload.
- Prod: multi‑stage build, минимальные образы (distroless/alpine), `--pull` для актуальности.
- Сканируйте уязвимости: `trivy image <img>` или Docker Scout.

## Раздел 8. Сети и DNS
- Пользовательские сети `docker network create devnet`. Сервисы в одной сети видят друг друга по имени.

## Раздел 9. Данные и бэкапы
- Томам давайте имена, делайте бэкапы: `docker run --rm -v pgdata:/data -v $(pwd):/backup alpine tar czf /backup/pg.tar.gz /data`.

## Раздел 10. Сборка в CI (GitHub Actions)
```yaml
name: docker-build-push
on: [push]
jobs:
  docker:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
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
```

## Раздел 11. Частые ошибки
- Конфликт портов: порт уже занят — поменяйте `ports` или остановите процесс.
- Разрешения в volume (Linux): настройте `user`/`group` или UID/GID, не работайте от root.
- CRLF vs LF: включите нормализацию `core.autocrlf` в Git и используйте LF внутри контейнера.

