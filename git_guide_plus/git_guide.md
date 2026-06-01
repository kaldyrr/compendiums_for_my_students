<div align="center">
  
# Гайд по системе контроля версий(подробненько)
  
![Git](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Git-logo.svg/250px-Git-logo.svg.png) ![](https://upload.wikimedia.org/wikipedia/commons/4/42/Invisible_square.png) ![GitHub](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/120px-GitHub_Invertocat_Logo.svg.png)

Материал написан для студентов, которые впервые знакомятся с системой контроля версий и GitHub. Он описывает жизнь репозитория: настройка Git, работа с ветками, Pull Request, Issues, Actions, безопасность и командные практики.

</div>

# 0. Готовые уроки.

| Урок | Тема | Статус | Дедлайн |
|------|------|--------|---------|
| 1 | [Установка и настройка Git](lessons/1.md) | 🟢 Активно | Как можно скорее |
| 2 | [Создание репозитория](lessons/2.md) | 🟢 Активно | Как можно скорее |
| 3 | [Клонирование репозитория](lessons/3.md) | 🟢 Активно | Как можно скорее |
| 4 | [Управление ветками](lessons/4.md) | 🟢 Активно | Как можно скорее |
| 5 | На базе полученных знаний поработать над вашим проектом | 🟡 Скоро | Как можно скорее |
| * | Индивидуальное задание | ⚫ Планируется | Когда будет, если будет |

# Актуализация 2026-06

- Последняя ревизия: 1 июня 2026.
- Базовый стек курса: актуальный Git 2.5x, GitHub CLI, Git Credential Manager, fine-grained Personal Access Tokens и SSH-ключи Ed25519.
- Для новых уроков используйте `git switch`/`git restore`, но объясняйте `checkout`, потому что он часто встречается в старых проектах.
- В security-блок добавьте secret scanning, push protection, signed commits/tags и правила branch protection.
- В интерактивном курсе Git проверяется через настоящие репозитории: история коммитов, ветки, конфликт, rebase, PR-процесс и CI.

# 1. Основы Git и GitHub
Git — распределённая система управления версиями. Проект был создан Линусом Торвальдсом для управления разработкой ядра Linux, первая версия выпущена 7 апреля 2005 года.

- Основные команды: commit (фиксирует состояние файлов), branch (ветка), remote (удалённый репозиторий), tag (метка на коммите).

GitHub — платформа-хостинг для Git репозиториев. Предоставляет Pull Requests (Запросы на включение), CI/CD (непрерывная интеграция/доставка), Issues (Задачи), Actions (Действия), Releases (Релизы), Packages (Пакеты).

Базовая разработка: разраб клонирует репозиторий → создаёт ветку → вносит изменения → отправляет Pull Request → проходит код ревью → ветка вливается в основную (main/master).

# 2. Установка и первичная настройка Git
## 2.1 Установка
Windows: [Git for Windows](https://git-scm.com/download/win). Во время установки отметьте интеграцию с Windows Terminal, включите `Git Credential Manager`.

Linux: `sudo apt install git` (Ubuntu), `sudo dnf install git` (Fedora), `sudo pacman -S git` (Arch, Manjaro).

macOS: `brew install git` или Xcode Command Line Tools (`xcode-select --install`).

## 2.2 Конфигурация
```bash
# Устанавливает ваше имя для всех Git-репозиториев на этом компьютере
# Это имя будет отображаться в истории коммитов
git config --global user.name "Имя пользователя"

# Устанавливает ваш email для всех Git-репозиториев
# Этот email будет связан с вашими коммитами
git config --global user.email "you@example.com"

# Настраивает VS Code как редактор по умолчанию для Git
# --wait заставляет Git ждать закрытия файла перед продолжением
# Используется для написания сообщений коммитов
git config --global core.editor "code --wait"

# Устанавливает имя основной ветки по умолчанию как "main"
# При создании новых репозиториев (git init) будет создаваться ветка main
git config --global init.defaultBranch main

# Меняет поведение git pull - использует rebase вместо merge
# Это сохраняет историю коммитов линейной и чистой
# Избегает создания лишних merge-коммитов
git config --global pull.rebase true

# Включает цветной вывод в Git-командах
# auto - автоматически определяет поддержку цветов терминалом
# Делает вывод git status, git diff и др. более читаемым
git config --global color.ui auto
```

## 2.3 Проверка
```bash
# Показывает установленную версию Git
# Проверяет, что Git правильно установлен и доступен в системе
git --version

# Выводит список всех текущих настроек Git
# Показывает как глобальные (--global), так и локальные настройки репозитория
git config --list
```

# 3. Настройки SSH-ключа и HTTPS токена
- SSH: безопасный способ доступа без ввода пароля.
  ```bash
  # Создаёт новую пару SSH-ключей типа Ed25519
  # -t ed25519 - указывает тип ключа (современный и безопасный)
  # -C "you@example.com" - добавляет комментарий с вашим email
  # В процессе запросит место сохранения и пароль для ключа
  ssh-keygen -t ed25519 -C "you@example.com"

  # Запускает SSH-агент в фоновом режиме
  # SSH-агент управляет вашими ключами в памяти
  # eval выполняет вывод команды ssh-agent -s в текущей оболочке
  eval "$(ssh-agent -s)"
  
  # Добавляет приватный ключ в SSH-агент
  # ~/.ssh/id_ed25519 - путь к вашему приватному ключу
  # Ключ загружается в память и становится доступным для SSH-клиента
  # Запросит пароль, если вы установили его при создании ключа
  ssh-add ~/.ssh/id_ed25519
  cat ~/.ssh/id_ed25519.pub            # копируйте только публичный ключ
  ```
Вставьте ключ в GitHub → Settings → SSH and GPG keys → New SSH key.

Проверьте: `ssh -T git@github.com`.
  
Personal Access Token (PAT): требуется для HTTPS и API. Создайте в GitHub → Settings → Developer settings → Personal access tokens (Fine-grained). Сохраните токен в `git credential manager`.

# 4. Создание и клонирование репозитория

## 4.1 Новый проект
```bash
# Создаёт новую папку с именем "my-project"
mkdir my-project

# Переходит в созданную папку
cd my-project

# Инициализирует новый Git-репозиторий в текущей папке
# Создаёт скрытую папку .git с внутренней структурой Git
git init

# Создаёт файл README.md и записывает в него строку "# My Project"
# > - оператор перенаправления вывода
echo "# My Project" > README.md

# Добавляет файл README.md в область подготовленных файлов (staging area)
# Git начинает отслеживать изменения этого файла
git add README.md

# Создаёт коммит с сообщением "chore: initial commit"
# Фиксирует текущее состояние подготовленных файлов
git commit -m "chore: initial commit"

# Добавляет удалённый репозиторий с именем "origin"
# Указывает ссылку на ваш репозиторий на GitHub
git remote add origin git@github.com:username/my-project.git

# Отправляет локальные коммиты в удалённый репозиторий
# -u (--set-upstream) - запоминает связь ветки main с origin/main
# Последующие push можно делать просто: git push
git push -u origin main
```

## 4.2 Клонирование существующего проекта
```bash
# Клонирует удалённый репозиторий с GitHub в текущую папку
# Создаёт папку "repository" и скачивает весь проект, историю коммитов и ветки
# git@github.com:... - использует SSH протокол для безопасного подключения
git clone git@github.com:organization/repository.git

# Переходит в папку склонированного репозитория
# Теперь вы находитесь в рабочей директории проекта
cd repository

# Показывает текущее состояние репозитория:
# - Какие файлы изменены
# - Какие файлы добавлены в staging area
# - Какие файлы не отслеживаются Git
# - Состояние ветки
git status
```

.gitignore: перечислите файлы, которые не должны попадать в репозиторий (`node_modules, bin, obj, .idea`, секреты).

.gitattributes: управление окончанием строк (`*.cs text diff=csharp`), LFS, настройки merge.

# 5. Управление ветками
Основная ветка: `main`. В продакшне защищена (Protected Branch): запрет force push, обязательные проверки.

Feature-ветка: `feature/short-description`.

Hotfix: `hotfix/issue-123`.

Release: `release/1.2.0` (по необходимости).

```bash
# Показывает список всех локальных веток
# Звездочкой (*) отмечает текущую активную ветку
git branch

# Переключается на ветку feature/login
# Более современная альтернатива git checkout
git switch feature/login

# Загружает последние изменения из удаленного репозитория
# Не сливает изменения, только обновляет информацию о ветках
git fetch origin

# Перемещает ваши коммиты на вершину обновленной ветки main
# Создает линейную историю без merge-коммитов
git rebase origin/main

# Сливает ветку feature/x в текущую ветку
# --no-ff создает merge-коммит даже при возможности fast-forward
# Сохраняет информацию о ветке в истории
git merge --no-ff feature/x

# Удаляет локальную ветку feature/x
# -d проверяет, что ветка полностью слита
git branch -d feature/x

# Удаляет ветку feature/x из удаленного репозитория origin
git push origin --delete feature/x
```

> Используйте rebase для локальной истории (до публикации), merge — для публичных веток.

# 6. Основной цикл работы
```bash
# Показывает текущее состояние репозитория:
# - Измененные файлы
# - Файлы в staged состоянии
# - Неотслеживаемые файлы
# - Состояние ветки
git status

# Обновляет локальную ветку из удаленного репозитория
# --rebase перемещает ваши коммиты поверх обновленной ветки
# Сохраняет историю чистой и линейной
git pull --rebase

# Создает и переключается на новую ветку feature/login
# Имя ветки описывает задачу (feature/login)
git switch -c feature/login

# === Вносите изменения в код ===
# Редактируете файл src/LoginService.cs

# Добавляет конкретный файл в staged состояние
# Git начинает отслеживать изменения этого файла
git add src/LoginService.cs

# Создает коммит с сообщением, описывающим изменение
# Сообщение в формате Conventional Commits (feat:)
git commit -m "feat: implement login service"

# Отправляет ветку feature/login в удаленный репозиторий (origin)
# -u устанавливает upstream связь для будущих push/pull
git push -u origin feature/login
```
- Для коммитов используйте [Conventional Commits](https://www.conventionalcommits.org/): `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
- Коммиты должны быть атомарными: один смысл — один commit. Сообщение в повелительном наклонении: `add`, `fix`, `update`.
- Если забыли файл, используйте `git commit --amend` (осторожно, переписывает историю) либо `git add` и `git commit --amend --no-edit`.

# 7. Pull Requests и code review
Создавайте PR(Pull Requests) через GitHub UI или CLI (`gh pr create`).

Шаблон PR(Pull Requests) (файл `.github/pull_request_template.md`) помогает не забыть описание, тесты, список задач.

Название PR(Pull Requests): `[Feature] Добавить авторизацию` или `fix: исправить падение клиента`.

В описании:
  1. Короткое резюме изменений.
  2. Скриншоты (если UI).
  3. Ссылки на связанные Issues (`Closes #123`).
  4. Чек-лист тестов (локально, unit, e2e).

В процессе ревью:
  - Отвечайте на комментарии, публикуйте решение (Resolve) после исправления.
  - Если PR(Pull Requests) «устарел», сделайте `git fetch origin && git rebase origin/main` или `git merge origin/main`.
    ```bash
    # Скачать последние изменения из удаленного репозитория (origin)
    # Не изменяет ваши локальные файлы, только обновляет информацию о ветках
    git fetch origin
    
    # Переместить ваши коммиты на вершину обновленной ветки main
    # Создает линейную историю без merge-коммитов
    git rebase origin/main

    # Скачать последние изменения из удаленного репозитория (origin)
    git fetch origin
    
    # Объединить изменения из origin/main в вашу текущую ветку
    # Создает отдельный merge-коммит для фиксации слияния
    git merge origin/main
    ```
  - Избегайте force push после того, как PR отправлен на ревью (если нужно переписать историю — предупредите ревьюеров).

# 8. Работа с Issues и Projects
Issues — задачи, баги, запросы фич. Используйте labels (`bug`, `feature`, `help wanted`), assignees (ответственные), milestones (релизы).
- Создайте шаблоны (`.github/ISSUE_TEMPLATE/bug_report.md`, `feature_request.md`), чтобы стандартизировать ввод.
- Projects (Classic и Beta) — канбан-доски, дорожные карты. Подходят для планирования спринтов.

Автоматизация:
  - Actions, которые при упоминании `Fixes #123` закрывают Issue.
  - Webhooks и GitHub Apps для интеграции с Jira, Linear, Trello.

# 9. Releases, теги, versioning
Семантическая версия: `MAJOR.MINOR.PATCH`.
  - `MAJOR` — несовместимые изменения.
  - `MINOR` — новые фичи без breaking changes.
  - `PATCH` — багфиксы.
Тегирование:
```bash
# Создает аннотированный тег с версией v1.0.0
# -a (annotated) - создает тег с дополнительной информацией
# v1.0.0 - имя тега в формате семантического версионирования
# -m "release 1.0.0" - сообщение тега, описывающее релиз
git tag -a v1.0.0 -m "release 1.0.0"

# Отправляет тег v1.0.0 в удаленный репозиторий origin
# Тег становится доступным другим участникам проекта
git push origin v1.0.0
```
GitHub Releases — страница релиза с артефактами (бинарники, zip) и changelog. Можно автоматически генерировать changelog с помощью `release-drafter` или `semantic-release`.

# 10. GitHub Actions (CI/CD)
Пример простого pipeline(Автоматизированный рабочий процесс или Цепочка действий CI/CD) для Node.js:
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
Secrets (`Settings → Secrets and variables → Actions`) — храните токены (`NPM_TOKEN`, `AZURE_CREDENTIALS`).

Матрицы: `strategy.matrix.node-version: [18, 20]`.

Кэширование: `actions/cache`.

Для деплоя используйте отдельные окружения (Environments) с ручным подтверждением и секретами (`production`, `staging`).

# 11. Безопасность и соответствие
Включайте Branch protection rules: обязательные ревьюеры, статические проверки, запрет прямых push.

Secret scanning и **Dependabot alerts** — встроенные механизмы поиска уязвимостей.

CODEOWNERS — автоматически назначает ревьюеров на файлы/каталоги. Пример:
  ```
  docs/ @tech-writers          # Все файлы в папке docs/ → команде tech-writers
  src/backend/ @backend-team   # Все файлы в src/backend/ → команде backend-team
  ```
Составляйте политики: PR должен иметь минимум 2 approve, тесты проходят, покрытие не падает.

Подпись коммитов (GPG или SSH) — `git config commit.gpgsign true`, `gh auth setup-git`.

# 12. Работа с форками и upstream
1. Нажмите Fork на GitHub, создайте копию в личном аккаунте.
2. Клонируйте: `git clone git@github.com:yourname/project.git`.
3. Добавьте оригинальный репозиторий как `upstream`:
   ```bash
   # Добавляет оригинальный репозиторий как удаленный с именем 'upstream'
   # Это ссылка на исходный проект, от которого вы сделали форк
   git remote add upstream git@github.com:source/project.git
    
   # Скачивает последние изменения из оригинального репозитория
   # Не меняет ваши локальные файлы, только обновляет информацию
   git fetch upstream
    
   # Перемещает ваши коммиты на вершину обновленной ветки main из upstream
   # Обновляет ваш форк до актуального состояния оригинала
   git rebase upstream/main
    
   # Отправляет обновленную ветку main в ваш форк на GitHub
   git push origin main
   ```
4. Создавайте feature‑ветки на основе `upstream/main`.
5. Отправляйте PR обратно в оригинальный репозиторий.

# 13. Полезные команды и приёмы
`git stash` / `git stash pop` — временно сохранить изменения.

`git restore --staged file` — убрать файл из индекса.

`git reset HEAD~1` — отменить последний commit (оставив изменения в рабочем каталоге).

`git reflog` — посмотреть историю действий (спасает при утерянных коммитах).

`git bisect` — бинарный поиск коммита, который внёс баг.

`git blame file` — кто, когда изменил строку (используйте для анализа, не для обвинений).

# 14. Типичные ошибки
1. Коммиты с WIP(Work In Progress) — трудно читать историю. Делайте финальные коммиты или squash перед merge.
2. Работа в ветке main — риск конфликтов и нестабильной ветки. Всегда работайте в отдельных ветках.
3. Большие PR(Pull Request) (400+ строк) — сложны в ревью. Разбивайте на меньшие.
4. Секреты в репозитории — удаляйте и меняйте ключи сразу. Используйте `.gitignore`, secret storage.
5. Игнорирование лицензии — указывайте `LICENSE` (MIT, Apache 2.0, GPL), чтобы потребители знали условия.
6. Необновлённый локальный репозиторий — перед началом работы делайте `git fetch` и `git pull --rebase`.

# 15. Дорожная карта освоения
1. Выучите базовые команды (`status`, `add`, `commit`, `branch`, `log`, `push`, `pull`).
2. Освойте ветвление, rebase и merge.
3. Настройте собственный проект: README, `.gitignore`, LICENSE.
4. Создайте Pull Request, пройдите ревью, научитесь вносить правки.
5. Настройте GitHub Actions и простую CI‑цепочку.
6. Добавьте Issue шаблоны, CODEOWNERS, Dependabot.
7. Изучите advanced темы: submodules, git-lfs, signed commits, `gh` CLI.

# 16. Заготовка для интерактивного курса

- Модули: `git-install`, `git-repo`, `git-branches`, `git-merge-rebase`, `git-github-pr`, `git-ci`, `git-security`.
- Автопроверка: состояние `git status`, наличие коммитов, корректные ветки, конфликтные файлы, remote/upstream, passing GitHub Actions.
- Проектная линия: локальный репозиторий -> GitHub remote -> feature branch -> PR -> review fixes -> release tag.
- Платные элементы: ревью истории коммитов, разбор конфликтов, настройка branch protection и GitHub Actions для учебного проекта.

## Ресурсы
Документация: [git-scm.com/doc](https://git-scm.com/doc), [docs.github.com](https://docs.github.com/).

Интерактивные тренажёры: [learngitbranching.js.org](https://learngitbranching.js.org/), [ohmygit.org](https://ohmygit.org/).

Книги: *Pro Git* (Scott Chacon), *Git for Teams* (Emma Jane Hogbin).

Практика: участвуйте в open-source проектах, отправляйте PR.

Инструменты: GitHub CLI (`gh`), GitKraken, Sourcetree, Fork.

Thx [kaldyrr](https://github.com/kaldyrr) from [ktkm](https://github.com/kotikme)

> Постоянно тренируйтесь фиксировать небольшие логические изменения, описывать их в сообщениях коммитов и вести PR(Pull Request). Это ключ к понятной истории проекта и эффективной командной работе.
<div align="center">
⭐ Не забудьте поставить звезду репозиторию, если материалы полезны!
</div> 
