# VPS deploy blueprint

Цель: держать первый MVP на небольшом VPS: 2 CPU core, 3.6 GHz, 10 GB free NVMe.

Это не готовый production compose, а ориентир для будущего приложения.

---

## Рекомендуемый старт

1. Собирать Docker image в GitHub Actions.
2. Публиковать image в GHCR.
3. На VPS делать только `docker pull` и restart.
4. Хранить SQLite, uploads и backups вне контейнера.
5. Держать runner отдельным процессом/контейнером с лимитами.

---

## Ограничения

- Не билдить image на VPS.
- Не запускать больше 1 runner job одновременно на старте.
- Не хранить полный workspace каждой попытки.
- Не ставить тяжелый monitoring stack.
- Включить log rotation и backup cleanup.

---

## Private repo

Для приватного репозитория используйте:
- GHCR read-only token для pull image;
- deploy key только если выбран `git pull` деплой;
- `.env` на сервере для secrets.

Личный токен создателя репозитория не должен лежать на VPS.
