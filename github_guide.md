# Компендим по Git и GitHub

Руководство для студента, который впервые сталкивается с системой контроля версий и GitHub. Описывает жизненный цикл репозитория: настройка Git‑клиента, работа с ветками, Pull Request, Issues, Actions, безопасность и командные практики.

---

## 1. Git и GitHub: ключевые понятия
- **Git** — распределённая система контроля версий. Основные сущности: commit (фиксирует состояние файлов), branch (ветка), tag (метка на коммите), remote (удалённый репозиторий).
- **GitHub** — платформа-хостинг для Git репозиториев. Предоставляет Issues, Pull Requests, Actions (CI/CD), Releases, Packages.
- **Основной процесс**: разработчик клонирует репозиторий → создаёт ветку → вносит изменения → отправляет Pull Request → проходит ревью → ветка вливается в основную (`main`/`master`).

---

## 2. Установка и первичная настройка Git
### 2.1 Установка
- **Windows**: [Git for Windows](https://git-scm.com/download/win). Во время установки отметьте интеграцию с Windows Terminal, включите `Git Credential Manager`.
- **macOS**: `brew install git` или Xcode Command Line Tools (`xcode-select --install`).
- **Linux**: `sudo apt install git` (Ubuntu), `sudo dnf install git` (Fedora).

### 2.2 Конфигурация
```bash
git config --global user.name "Имя Фамилия"
git config --global user.email "you@example.com"
git config --global core.editor "code --wait"        # VS Code в качестве редактора сообщений
git config --global init.defaultBranch main
git config --global pull.rebase true                 # предпочтительно rebase поверх merge
git config --global color.ui auto
```

### 2.3 Проверка
```bash
git --version
git config --list
```

---

## 3. Настройка SSH-ключа и HTTPS токена
- **SSH**: безопасный способ доступа без ввода пароля.
  ```bash
  ssh-keygen -t ed25519 -C "you@example.com"
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/id_ed25519
  cat ~/.ssh/id_ed25519.pub            # скопируйте ключ
  ```
  Вставьте ключ в GitHub → Settings → SSH and GPG keys → New SSH key. Проверьте: `ssh -T git@github.com`.
- **Personal Access Token (PAT)**: требуется для HTTPS и API. Создайте в GitHub → Settings → Developer settings → Personal access tokens (Fine-grained). Сохраните токен в `git credential manager`.

---

## 4. Создание и клонирование репозитория
### 4.1 Новый проект
```bash
mkdir my-project
cd my-project
git init
echo "# My Project" > README.md
git add README.md
git commit -m "chore: initial commit"
git remote add origin git@github.com:username/my-project.git
git push -u origin main
```

### 4.2 Клонирование существующего проекта
```bash
git clone git@github.com:organization/repository.git
cd repository
git status
```

- **`.gitignore`**: перечислите файлы, которые не должны попадать в репозиторий (`node_modules`, `bin`, `obj`, `.idea`, секреты).
- **`.gitattributes`**: управление окончанием строк (`*.cs text diff=csharp`), LFS, настройки merge.

---

## 5. Основной цикл работы
```bash
git status                          # проверить состояние
git pull --rebase                   # обновиться из origin/main
git checkout -b feature/login       # новая ветка

# изменения, добавление, коммит
git add src/LoginService.cs
git commit -m "feat: implement login service"

git push -u origin feature/login    # отправка ветки
```
- Для коммитов используйте [Conventional Commits](https://www.conventionalcommits.org/): `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
- Коммиты должны быть атомарными: один смысл — один commit. Сообщение в повелительном наклонении: `add`, `fix`, `update`.
- Если забыли файл, используйте `git commit --amend` (осторожно, переписывает историю) либо `git add` и `git commit --amend --no-edit`.

---

## 6. Управление ветками
- **Основная ветка**: `main`. В продакшне защищена (Protected Branch): запрет force push, обязательные проверки.
- **Feature-ветка**: `feature/short-description`.
- **Hotfix**: `hotfix/issue-123`.
- **Release**: `release/1.2.0` (по необходимости).

```bash
git branch                     # список веток
git switch feature/login       # переключение
git fetch origin               # обновление удалённых ссылок
git rebase origin/main         # подтащить актуальную историю
git merge --no-ff feature/x    # слияние без fast-forward
git branch -d feature/x        # удалить локально
git push origin --delete feature/x
```

> Используйте rebase для локальной истории (до публикации), merge — для публичных веток.

---

## 7. Pull Requests и code review
- Создавайте PR через GitHub UI или CLI (`gh pr create`).
- Шаблон PR (файл `.github/pull_request_template.md`) помогает не забыть описание, тесты, список задач.
- Название PR: `[Feature] Добавить авторизацию` или `fix: исправить падение клиента`.
- В описании:
  1. Короткое резюме изменений.
  2. Скриншоты (если UI).
  3. Ссылки на связанные Issues (`Closes #123`).
  4. Чек-лист тестов (локально, unit, e2e).
- В процессе ревью:
  - Отвечайте на комментарии, публикуйте решение (Resolve) после исправления.
  - Если PR «устарел», сделайте `git fetch origin && git rebase origin/main` или `git merge origin/main`.
  - Избегайте force push после того, как PR отправлен на ревью (если нужно переписать историю — предупредите ревьюеров).

---

## 8. Работа с Issues и Projects
- **Issues** — задачи, баги, запросы фич. Используйте labels (`bug`, `feature`, `help wanted`), assignees (ответственные), milestones (релизы).
- Создайте шаблоны (`.github/ISSUE_TEMPLATE/bug_report.md`, `feature_request.md`), чтобы стандартизировать ввод.
- **Projects** (Classic и Beta) — канбан-доски, дорожные карты. Подходят для планирования спринтов.
- Автоматизация:
  - Actions, которые при упоминании `Fixes #123` закрывают Issue.
  - Webhooks и GitHub Apps для интеграции с Jira, Linear, Trello.

---

## 9. Releases, теги, versioning
- Семантическая версия: `MAJOR.MINOR.PATCH`.
  - `MAJOR` — несовместимые изменения.
  - `MINOR` — новые фичи без breaking changes.
  - `PATCH` — багфиксы.
- Тегирование:
  ```bash
  git tag -a v1.0.0 -m "release 1.0.0"
  git push origin v1.0.0
  ```
- GitHub Releases — страница релиза с артефактами (бинарники, zip) и changelog. Можно автоматически генерировать changelog с помощью `release-drafter` или `semantic-release`.

---

## 10. GitHub Actions (CI/CD)
Пример простого pipeline для Node.js:
```yaml
name: ci
on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - name: Lint
        run: npm run lint
```
- Secrets (`Settings → Secrets and variables → Actions`) — храните токены (`NPM_TOKEN`, `AZURE_CREDENTIALS`).
- Матрицы: `strategy.matrix.node-version: [18, 20]`.
- Кэширование: `actions/cache`.
- Для деплоя используйте отдельные окружения (Environments) с ручным подтверждением и секретами (`production`, `staging`).

---

## 11. Безопасность и соответствие
- Включайте **Branch protection rules**: обязательные ревьюеры, статические проверки, запрет прямых push.
- **Secret scanning** и **Dependabot alerts** — встроенные механизмы поиска уязвимостей.
- **CODEOWNERS** — автоматически назначает ревьюеров на файлы/каталоги. Пример:
  ```
  docs/ @tech-writers
  src/backend/ @backend-team
  ```
- **Составляйте политики**: PR должен иметь минимум 2 approve, тесты проходят, покрытие не падает.
- Подпись коммитов (GPG или SSH) — `git config commit.gpgsign true`, `gh auth setup-git`.

---

## 12. Работа с форками и upstream
1. Нажмите **Fork** на GitHub, создайте копию в личном аккаунте.
2. Клонируйте: `git clone git@github.com:yourname/project.git`.
3. Добавьте оригинальный репозиторий как `upstream`:
   ```bash
   git remote add upstream git@github.com:source/project.git
   git fetch upstream
   git rebase upstream/main
   git push origin main
   ```
4. Создавайте feature‑ветки на основе `upstream/main`.
5. Отправляйте PR обратно в оригинальный репозиторий.

---

## 13. Полезные команды и приёмы
- `git stash` / `git stash pop` — временно сохранить изменения.
- `git restore --staged file` — убрать файл из индекса.
- `git reset HEAD~1` — отменить последний commit (оставив изменения в рабочем каталоге).
- `git reflog` — посмотреть историю действий (спасает при утерянных коммитах).
- `git bisect` — бинарный поиск коммита, который внёс баг.
- `git blame file` — кто, когда изменил строку (используйте для анализа, не для обвинений).

---

## 14. Типичные ошибки
1. **Коммиты с `WIP`** — трудно читать историю. Делайте финальные коммиты или squash перед merge.
2. **Работа в `main`** — риск конфликтов и нестабильной ветки. Всегда работайте в отдельных ветках.
3. **Большие PR** (>400 строк) — сложны в ревью. Разбивайте на меньшие.
4. **Секреты в репозитории** — удаляйте и меняйте ключи сразу. Используйте `.gitignore`, secret storage.
5. **Игнорирование лицензии** — указывайте `LICENSE` (MIT, Apache 2.0, GPL), чтобы потребители знали условия.
6. **Необновлённый локальный репозиторий** — перед началом работы делайте `git fetch` и `git pull --rebase`.

---

## 15. Дорожная карта освоения
1. Выучите базовые команды (`status`, `add`, `commit`, `branch`, `log`, `push`, `pull`).
2. Освойте ветвление, rebase и merge.
3. Настройте собственный проект: README, `.gitignore`, LICENSE.
4. Создайте Pull Request, пройдите ревью, научитесь вносить правки.
5. Настройте GitHub Actions и простую CI‑цепочку.
6. Добавьте Issue шаблоны, CODEOWNERS, Dependabot.
7. Изучите advanced темы: submodules, git-lfs, signed commits, `gh` CLI.

---

## 16. Ресурсы
- Документация: [git-scm.com/doc](https://git-scm.com/doc), [docs.github.com](https://docs.github.com/).
- Интерактивные тренажёры: [learngitbranching.js.org](https://learngitbranching.js.org/), [ohmygit.org](https://ohmygit.org/).
- Книги: *Pro Git* (Scott Chacon), *Git for Teams* (Emma Jane Hogbin).
- Практика: участвуйте в open-source проектах, отправляйте PR.
- Инструменты: GitHub CLI (`gh`), GitKraken, Sourcetree, Fork.

> Постоянно тренируйтесь фиксировать небольшие логические изменения, описывать их в сообщениях коммитов и вести PR. Это ключ к понятной истории проекта и эффективной командной работе.
