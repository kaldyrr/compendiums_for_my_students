# Руководство по Git и GitHub (практика)

Короткий, практичный и понятный гид: от установки до PR и CI.

## Раздел 1. Git vs GitHub: что к чему
- Git — система контроля версий локально (коммиты, ветки, слияния).
- GitHub — сервер (хостинг) репозиториев + PR, Issues, Actions, Releases.
- Базовые сущности: commit, branch, tag, remote, PR, Issue, Release.

## Раздел 2. Установка и начальная настройка
- Установка: Windows — Git for Windows; macOS — `brew install git`; Linux — `apt/yum`.
- Имя/почта: `git config --global user.name "Имя"` и `git config --global user.email "почта@домен"`.
- Цвета/удобства: `git config --global color.ui auto`.

## Раздел 3. SSH‑ключи и доступ
- Создать ключ: `ssh-keygen -t ed25519 -C "почта@домен"` (и добавить в ssh-agent).
- Копировать публичный ключ: `cat ~/.ssh/id_ed25519.pub` → вставить в GitHub (Settings → SSH keys).
- Проверить: `ssh -T git@github.com` (ожидается приветствие).

## Раздел 4. Базовый цикл работы
```bash
# клонирование
git clone git@github.com:USER/REPO.git && cd REPO
# статус, индексирование и коммит
git status
git add .            # или конкретные файлы
git commit -m "feat: краткое описание изменения"
# синхронизация
git pull --rebase    # подтянуть изменения
git push             # отправить свои коммиты
```
- Игнорирование: добавить `.gitignore` (например, `node_modules/`, `bin/`, `.idea/`).
- Глобальный игнор: `~/.gitignore_global` + `git config --global core.excludesfile ~/.gitignore_global`.
- Стиль сообщений: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`...).

## Раздел 5. Ветвление: feature → main
```bash
# создать ветку от main
git checkout -b feat/login main
# работа → коммиты → отправка
git push -u origin feat/login
# обновление ветки от main
git fetch origin
git rebase origin/main       # или git merge origin/main
```
- Конфликты: правим конфликтующие файлы, `git add`, `git rebase --continue`.
- Временное сохранение: `git stash` (и `git stash pop`).

## Раздел 6. Pull Request (PR)
- Создайте PR из своей ветки в `main`. Опишите цель, добавьте скриншоты.
- Привяжите Issue: `Fixes #123` в описании закроет задачу при мерже.
- Ревью: отвечайте на обсуждения, дополняйте коммиты. Мердж: `squash` (по желанию).
- Защита ветки: Branch protection rules (обязательные ревью/чек‑раны, запрет force‑push).

## Раздел 7. Issues и Projects
- Issues: баги/фичи. Метки (labels), исполнители (assignees), Milestones.
- Projects: канбан‑доски, бэклог, приоритезация. Templates для Issues/PR — в `.github/`.

## Раздел 8. Теги, релизы и версионирование
```bash
# аннотированный тег и пуш
git tag -a v1.0.0 -m "Первый релиз"
git push origin v1.0.0
```
- Семантические версии: MAJOR.MINOR.PATCH.
- GitHub Releases: описание релиза, бинарники, changelog.

## Раздел 9. GitHub Actions (CI примеры)
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18' }
      - run: npm ci && npm test
```
- Секреты: Settings → Secrets → Actions; доступ через `secrets.MY_TOKEN`.
- Кэширование зависимостей (`actions/cache`), matrix‑сборки, статический анализ.

## Раздел 10. Безопасность
- Включите 2FA; проверяйте Dependabot Alerts; включите secret scanning.
- `CODEOWNERS` для авто‑ревью; защита веток; ограничение force‑push.

## Раздел 11. Типичные проблемы и решения
- Синхронизация форка:
```bash
git remote add upstream git@github.com:ORIGINAL/REPO.git
git fetch upstream
git rebase upstream/main
```
- Откат коммита: `git revert <hash>` (без переписывания истории); `git restore` для файлов.
- «Потерял коммиты»: `git reflog` помогает найти и вернуть состояние.
