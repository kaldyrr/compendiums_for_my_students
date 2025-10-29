# Гайд по IDE: выбор, настройка и продуктивная работа

Цель — быстро настроить удобную среду под ваши стеки (TS, Go, C#, Rust, Swift, Kotlin, SQL/NoSQL).

## Раздел 1. Что выбрать
- VS Code — лёгкий, расширяемый, универсальный редактор (много плагинов).
- JetBrains IDE: Rider (C#), IntelliJ IDEA (мульти‑языковая), PyCharm, GoLand, CLion, RustRover.
- Visual Studio (Windows, .NET), Xcode (Swift/iOS/macOS), Android Studio (Kotlin/Android).

## Раздел 2. VS Code — быстрая настройка
- Базовые расширения:
  - TypeScript/JavaScript: ESLint, Prettier, GitLens, Path Intellisense.
  - Go: Go (golang.go), Delve для отладки.
  - C#: C#/C# Dev Kit.
  - Rust: rust‑analyzer.
  - Python: Python, Pylance.
  - Docker: Docker.
  - SQL: SQLTools, SQLFluff (lint), PostgreSQL.
  - Markdown: Markdown All in One.
- Общие настройки (`settings.json`):
```json
{
  "editor.formatOnSave": true,
  "files.eol": "\n",
  "editor.rulers": [100],
  "editor.tabSize": 2,
  "files.trimTrailingWhitespace": true
}
```
- Отладка: `Run and Debug` → создать `launch.json` (Node/Go/.NET/Rust). Примеры создаёт сам VS Code.
- Задачи: `Tasks: Configure Task` → сборка/тесты/линт в один клик.
- Workspace рекомендации: `.vscode/extensions.json` с рекомендуемыми расширениями для команды.

## Раздел 3. JetBrains IDE — быстро и мощно
- Установите IDE под стек (Rider/IntelliJ/GoLand/PyCharm/CLion).
- Импорт проекта: автоконфиг сборок (Gradle/Maven/.NET/Cargo/Go Modules).
- Полезное:
  - Code Style + инспекции (Warnings as errors).
  - Live Templates (шаблоны кода).
  - Run Configurations (запуск/отладка), Coverage.
  - VCS интеграция: коммиты, ветки, ревью прямо в IDE.
- Плагины:
  - ESLint/Prettier, Docker, Database Tools, Markdown, Key Promoter X.
- Tip: исключите `.idea/` из Git (или храните части, например, `codeStyles/`).

## Раздел 4. Visual Studio (Windows, .NET)
- Установите рабочие нагрузки: `.NET desktop development`, `ASP.NET and web`.
- Возможности: Debugger, Test Explorer, Profiler, Git интеграция.

## Раздел 5. Xcode (Swift)
- Быстрый старт: `swift package init` или Xcode Project/Workspace.
- Отладка: breakpoints, LLDB, Instruments (профилирование).

## Раздел 6. Android Studio (Kotlin)
- Настройте SDK/эмуляторы, Gradle. Инструменты: Layout Inspector, Profiler.

## Раздел 7. Отладка — базовый сценарий
- Точки останова, шаги (`step over/into/out`), Watches/Variables.
- Attach to Process (бэкенд‑сервисы), Remote Debug (SSH/порт‑форвардинг).
- Отладка тестов: запуск тестов из IDE с точками останова.

## Раздел 8. Линтеры и форматтеры (единый стиль)
- TypeScript: ESLint + Prettier.
- Go: `gofmt`/`go fmt`, `golangci-lint`.
- C#: `dotnet format`, анализаторы Roslyn, StyleCop.
- Rust: `rustfmt`, `clippy`.
- Kotlin: ktlint/detekt.
- Swift: SwiftFormat/SwiftLint.
- SQL: SQLFluff.
- EditorConfig в корне:
```ini
# .editorconfig
root = true
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
```

## Раздел 9. Git внутри IDE
- Stage/commit/branch/merge/resolve conflicts, blame, сравнение изменений.
- Подпись коммитов (GPG/SSH), Conventional Commits шаблоны.

## Раздел 10. Полезные приёмы
- Мульти‑root workspace (VS Code) или проект‑workspace (JetBrains).
- Dev Containers/WSL2 для изоляции окружения.
- Быстрые макросы и кодовые шаблоны для повторяющихся действий.

