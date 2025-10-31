# Компендим по IDE и инструментам разработки

Помогает выбрать и настроить рабочее окружение для языков TypeScript, Go, C#, Rust, Swift, Kotlin, SQL/NoSQL. Рассчитан на студента, который впервые сталкивается с профессиональными IDE.

---

## 1. Как выбрать IDE
- **Тип проекта**: backend, frontend, мобильная разработка, игры, анализ данных.
- **Языки**: некоторые IDE оптимизированы под конкретный стек (JetBrains Rider для .NET, GoLand для Go).
- **Интеграции**: Git, CI/CD, Docker, базы данных, дебаггеры.
- **Аппаратные ресурсы**: тяжёлые IDE требуют 8+ ГБ RAM. Лёгкие редакторы (VS Code, Neovim) подойдут для слабых машин.
- **Лицензирование**: JetBrains — платные, есть студенческие лицензии. VS Code, Visual Studio Community, Swift Playgrounds — бесплатны.

---

## 2. Базовая настройка рабочего места
1. **Обновите ОС и драйверы**: поддержка современных Docker/WSL/Hyper-V.
2. **Установите менеджеры пакетов**: `winget`/`choco` (Windows), `brew` (macOS), `apt`/`dnf` (Linux).
3. **Настройте шрифты**: FiraCode, JetBrains Mono (поддержка лигатур).
4. **Выберите тему**: светлая/тёмная (важно для долговременной работы).
5. **Настройте клавиатурные раскладки и хоткеи**: убедитесь, что IDE использует единый набор (например, keymap VS Code, IntelliJ).

---

## 3. Visual Studio Code
Лёгкая кроссплатформенная среда, гибкая через расширения.

### 3.1 Основные расширения по стекам
- **TypeScript/JavaScript**: `ESLint`, `Prettier`, `TypeScript ESLint Plugin`, `Path Intellisense`, `Import Cost`.
- **Go**: `Go` (автоустановка `gopls`, `dlv`), `Go Test Explorer`, `Go Template Support`.
- **C#**: `C# Dev Kit`, `C#` (powered by Roslyn), `Ionide` (для F#).
- **Rust**: `rust-analyzer`, `Crates`, `CodeLLDB`.
- **Python**: `Python`, `Pylance`, `Jupyter`.
- **SQL**: `SQLTools`, `SQLFluff`, `PostgreSQL`, `Database Client`.
- **Docker и контейнеры**: `Docker`, `Dev Containers`.
- **Документация**: `Markdown All in One`, `Draw.io Integration`.

### 3.2 Настройки пользователя (`settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.rulers": [100],
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.eol": "\n",
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "explorer.confirmDelete": false,
  "git.enableSmartCommit": true,
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

### 3.3 Рабочие области
- `.vscode/settings.json` — настройки для проекта.
- `.vscode/extensions.json` — рекомендуемые расширения.
- `launch.json` — конфигурация отладки (Node, Go, .NET, Python).
- `tasks.json` — пользовательские команды (например, `npm run test`, `go test`, `dotnet test`).

### 3.4 Полезные приёмы
- **Multi-root workspace**: объединяйте несколько проектов в одну IDE.
- **Remote SSH/Dev Containers**: полноценная разработка в контейнере/на сервере.
- **Live Share**: совместная работа.

---

## 4. JetBrains IDE (IntelliJ-платформа)
Серия продуктов: IntelliJ IDEA, Rider, GoLand, CLion, PyCharm, WebStorm, RustRover, DataGrip.

### 4.1 Первичная настройка
- Установите одну IDE, затем подключайте плагины или используйте отдельные продукты.
- Включите синхронизацию настроек с помощью JetBrains Account.
- Настройте темы (Darkula, IntelliJ Light) и шрифты (JetBrains Mono).

### 4.2 Ключевые возможности
- Автоматическое форматирование и инспекции кода (Warnings as Errors).
- Run/Debug configurations, Coverage, Profiler (в Rider, IntelliJ Ultimate).
- Live Templates — шаблоны для генерации кода (`fori`, `test`, `log`).
- UML, Database Tool, HTTP Client (`.http` файлы).
- Встроенный Git: коммиты, ревью, cherry-pick, rebase, конфликт-мёрдж.

### 4.3 Рекомендуемые плагины
- `Key Promoter X` — учит хоткеям.
- `Rainbow Brackets`, `GitToolBox`, `PlantUML`, `SonarLint`.
- В Rider — интеграция с Unity, Azure DevOps, Docker.
- В IntelliJ IDEA — Kotlin, Spring, Gradle, Database tools.

### 4.4 Управление проектами
- Открывайте проект целиком, IDE сама распознает `pom.xml`, `build.gradle`, `.sln`, `go.mod`, `Cargo.toml`.
- Используйте `Project Structure` для настройки SDK и выходных путей.
- Настройте `Inspections Profile` и `Code Style` для командного стандарта.

---

## 5. Visual Studio (Windows, .NET)
- Установите рабочие нагрузки: `.NET desktop`, `ASP.NET and web`, `Azure development`, `Games with Unity`.
- Device simulators: Android Emulator, UWP.
- Инструменты: Test Explorer, Live Unit Testing, IntelliTrace, SQL Server Data Tools.
- Расширения: `ReSharper`, `Productivity Power Tools`, `GitHub Extension`, `NCrunch`.

---

## 6. Xcode и Swift Playgrounds
- **Xcode**: необходим для iOS/macOS разработки, содержит Interface Builder, Instruments (профайлер), симуляторы устройств, `swiftc`.
- Настройка:
  - Установите через App Store.
  - Установите командные утилиты: `xcode-select --install`.
- Используйте Swift Package Manager (SPM) для зависимостей (`File → Add Package Dependency`).
- Instruments: Time Profiler, Memory Leaks, Energy Diagnostics.
- Swift Playgrounds — для интерактивного изучения Swift.

---

## 7. Android Studio и Kotlin
- Установите Android Studio (JetBrains, на базе IntelliJ).
- Настройте SDK Manager (версии Android), Emulator (AVD).
- Gradle Build variants (`debug`, `release`), ViewBinding, Jetpack Compose tooling.
- Инструменты: Layout Inspector, Profiler, Firebase Assistant, Logcat.
- Для мультиплатформы используйте Kotlin Multiplatform Mobile (KMM) плагин.

---

## 8. Rust и система сборки
- **RustRover** или **CLion** с плагином Rust — полноценная IDE (поддержка Cargo, Run Configurations, LLDB).
- VS Code: `rust-analyzer`, `CodeLLDB`, `C/C++`.
- `cargo fmt`, `cargo clippy`, `cargo expand`.
- Интеграция с `lldb`, `gdb`, `perf`.

---

## 9. Работа с базами данных и SQL
- JetBrains DataGrip или встроенный Database Tool (IntelliJ, Rider).
- DBeaver, Azure Data Studio, TablePlus.
- Для VS Code: `SQLTools`, `DB Client`, `vscode-database`.
- SQL форматирование: `SQLFluff`, `pgFormatter`.
- Инструменты миграций: Flyway CLI, Liquibase, Atlas.

---

## 10. Отладка и профилирование
- **VS Code**:
  - `F5` — запуск отладки.
  - `launch.json` настроит `program`, `args`, `env`, `cwd`.
  - Расширения: `Debugger for Chrome`, `Java Debugger`, `CppTools`.
- **JetBrains**:
  - Breakpoints (условные, по выражению), Evaluate Expression.
  - Remote Debug (подключение к процессу по TCP).
  - Memory View, CPU Profiler (в Ultimate/Рider).
- **Visual Studio**:
  - Diagnostic Tools, Performance Profiler, Snapshot Debugging в Azure.
- **Xcode**:
  - LLDB, Instruments (Time Profiler, Allocations, Leaks).
- **Android Studio**:
  - Layout Inspector, CPU/GPU/Memory profiler, Network profiler.

---

## 11. Форматирование и линтинг
- Настройте `.editorconfig` в корне репозитория:
  ```ini
  root = true
  [*]
  charset = utf-8
  end_of_line = lf
  insert_final_newline = true
  trim_trailing_whitespace = true
  indent_style = space
  indent_size = 2

  [*.cs]
  indent_size = 4

  [*.go]
  indent_style = tab
  ```
- Инструменты:
  - TypeScript: `ESLint`, `Prettier`.
  - Go: `gofmt`, `goimports`, `golangci-lint`.
  - C#: `dotnet format`, Roslyn analyzers, StyleCop.
  - Rust: `cargo fmt`, `cargo clippy`.
  - Kotlin: `ktlint`, `detekt`.
  - Swift: `SwiftFormat`, `SwiftLint`.
  - SQL: `sqlfluff`, `pgformatter`.

---

## 12. Интеграция с Git и GitHub
- VS Code: вкладка Source Control, GitLens, Git Graph.
- JetBrains: Git tool window, Code Review, GitHub pull requests, cherry-pick, rebase interactively.
- Visual Studio: Git Changes, Branches, встроенный diff.
- Полезные советы:
  - Включите автосохранение или форматирование перед коммитом.
  - Настройте pre-commit hooks (`lint-staged`, `husky`, `lefthook`).
  - Используйте Conventional Commits или шаблоны сообщений (commit template).

---

## 13. Удалённая разработка
- **WSL2** (Windows): установка Linux окружения, доступ к файлам. В VS Code используйте `Remote - WSL`.
- **Remote SSH**: подключение к серверу, разработка в среде с нужными зависимостями.
- **Dev Containers**: репозиторий содержит `.devcontainer/` с Dockerfile + devcontainer.json. IDE запускает контейнер и монтирует код.
- **GitHub Codespaces**: облачная среда VS Code, интегрируется с репозиторием.

---

## 14. Оптимизация рабочего процесса
- Изучите хоткеи (Command Palette в VS Code `Ctrl+Shift+P`, в JetBrains — `Ctrl+Shift+A`).
- Настройте `snippet`/Live Templates для шаблонов кода.
- Используйте расширения автогенерации (например, Go: `impl`, TypeScript: `TS Snippets`, C#: `Resharper` генераторы).
- Настройте `TODO` и `FIXME` комментарии, чтобы IDE подсвечивала их.
- Включайте автообновление зависимостей (Dependabot, Renovate) и проверку лицензий.

---

## 15. Типичные ошибки и как их избежать
1. **Работа «из коробки» без настройки форматтера** — приводит к хаосу в коде. Настройте `formatOnSave`.
2. **Плагины, дублирующие функциональность** — конфликтуют и замедляют IDE. Выключайте лишнее.
3. **Игнорирование предупреждений компилятора/IDE** — они часто указывают на реальные баги.
4. **Отсутствие резервного копирования настроек** — используйте синхронизацию (GitHub gist, JetBrains account).
5. **Работа под администратором** — запускайте IDE от обычного пользователя, используйте `sudo` только по необходимости.

---

## 16. Дорожная карта для новичка
1. Установите выбранную IDE и сделайте базовую настройку (шрифты, тема, git).
2. Настройте форматтер и линтер под язык учебного проекта.
3. Освойте отладку: выставление breakpoints, просмотр переменных.
4. Подключите расширения для работы с БД, Docker, тестами.
5. Настройте Git-интеграцию и CI/CD (например, GitHub Actions).
6. Переходите к удалённой разработке (Dev Containers, SSH) при работе в команде.
7. Изучите профилирование и анализ производительности (Instruments, Visual Studio Profiler, pprof).

---

## 17. Полезные ресурсы
- Документация IDE: [code.visualstudio.com/docs](https://code.visualstudio.com/docs), [jetbrains.com/help](https://www.jetbrains.com/help/), [learn.microsoft.com/visualstudio](https://learn.microsoft.com/visualstudio/).
- Настройки и плагины: Awesome VS Code, Awesome JetBrains.
- Курсы: официальные гайды VS Code, JetBrains Academy, Microsoft Learn.
- Сообщества: Reddit (`r/vscode`, `r/JetBrains`), Stack Overflow, локальные Slack/Telegram группы.

> Потратьте время на настройку IDE один раз — это окупится скоростью и качеством разработки, а также облегчит командную работу и онбординг новых участников.
