# Компендим по C# и .NET

Подробный путеводитель для студента и практикующего разработчика: от установки SDK до построения продакшн‑сервисов, тестирования и отладки. Материал рассчитан на читателя, который впервые сталкивается с C#, поэтому каждую тему сопровождают пояснения, примеры и ссылки на следующие шаги.

---

## 1. Что такое C# и экосистема .NET
- **C#** — строго типизированный язык общего назначения. Используется для backend‑разработки, desktop и мобильных приложений, игр (Unity), встраиваемых систем, облачных сервисов.
- **.NET** — кроссплатформенная платформа от Microsoft. Включает CLR (виртуальную машину), стандартную библиотеку, SDK с инструментами сборки и упаковки, а также обширную экосистему библиотек.
- **.NET SDK** = компилятор + CLI (`dotnet`) + шаблоны проектов + NuGet (менеджер пакетов).
- **.NET Runtime** — минимальный набор, необходимый для запуска готовых приложений (CoreCLR для C#, CoreFX для библиотек).

> Для полноценной разработки всегда устанавливаем SDK, а не только рантайм.

---

## 2. Подготовка окружения
### 2.1 Windows
1. Скачайте [Visual Studio Installer](https://visualstudio.microsoft.com/vs/) или [официальный .NET SDK](https://dotnet.microsoft.com/en-us/download).
2. При установке Visual Studio выберите рабочие нагрузки: **`.NET desktop`**, **`ASP.NET and web`**, **`Azure`** (по необходимости).
3. Дополнительно установите Windows Terminal или PowerShell 7 для удобной работы с CLI.

### 2.2 macOS
1. Установите [Homebrew](https://brew.sh/).
2. Выполните `brew install --cask dotnet-sdk` либо используйте официальный установщик.
3. Для IDE можно поставить **Visual Studio for Mac** (подходит для основной части .NET разработки) или **JetBrains Rider**.

### 2.3 Linux (Ubuntu пример)
```bash
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel STS
```
Добавьте `~/.dotnet` в `PATH`. Для популярных дистрибутивов есть пакеты `apt install dotnet-sdk-8.0`.

### 2.4 Проверка установки
```bash
dotnet --info       # версия SDK и статус окружения
dotnet new console -n Hello
cd Hello
dotnet run
```
После выполнения команды `dotnet run` в терминале должна появиться строка `Hello, World!`.

---

## 3. Инструменты разработки и плагины
- **Visual Studio** — официальный IDE для Windows, глубокая интеграция с .NET, профилирование, дизайнеры UI.
- **JetBrains Rider** — кроссплатформенный, удобная навигация, продвинутый рефакторинг, поддержка Unity, Azure, AWS.
- **VS Code** — лёгкая среда; для C# обязательно расширение *C# Dev Kit* или *C# (powered by Roslyn)*, плюс OmniSharp (если нужен старый стек). Для тестов и форматирования добавьте *Test Explorer UI*, *EditorConfig*.
- **Дополнительные инструменты**: Git (управление версиями), Docker (развёртывание), Postman/Bruno (тестирование API), DBeaver/Azure Data Studio (работа с БД).

### Рекомендуемые настройки `.editorconfig`
```ini
[*.cs]
indent_style = space
indent_size = 4
dotnet_sort_system_directives_first = true
csharp_new_line_before_open_brace = types, methods, properties, accessors
csharp_preferred_modifier_order = public, private, protected, internal, static, readonly, sealed, override
```

---

## 4. Структура проектов и решений
- *Solution* (`.sln`) — контейнер для одного или нескольких проектов.
- *Проект* (`.csproj`) — описывает таргетируемые фреймворки, зависимости, файлы.
- CLI шаблоны:
  ```bash
  dotnet new console -n LearnBasics             # консоль
  dotnet new webapi -n LearnApi                 # REST API
  dotnet new classlib -n LearnLib               # библиотека
  dotnet new xunit -n LearnTests                # тесты
  dotnet new sln -n LearnSolution
  dotnet sln add LearnBasics/LearnBasics.csproj
  ```
- **Target Framework Monikers (TFM)**: `net8.0`, `netstandard2.1`, `net48`. Чем новее версия `netX.Y`, тем больше возможностей CLR.
- **NuGet** — менеджер пакетов (`dotnet add package AutoMapper`). Следите за версиями и лицензиями.

---

## 5. Базовый синтаксис и типы
- Простые типы: `bool`, целочисленные (`int`, `long`), вещественные (`double`, `decimal`), `char`, `string` (UTF‑16), `DateTime`, `TimeOnly`, `Guid`.
- `var` даёт вывод типа, но тип остаётся статическим.
- `default` инициализирует тип нулевым значением (`0`, `false`, `null`).
- `checked`/`unchecked` контролируют переполнение (актуально для финансовых расчётов).
- Строки интерполируются: `$"Баланс: {amount:C2}"`.

```csharp
int hours = 40;
decimal rate = 1150.75m;
decimal salary = hours * rate;
Console.WriteLine($"Зарплата за неделю: {salary:F2} ₽");
```

---

## 6. Управляющие конструкции
- `if / else`, тернарный оператор `condition ? a : b`.
- `switch` поддерживает шаблоны (pattern matching) и `when`-фильтры.
- Циклы: `for`, `foreach`, `while`, `do while`. Для перечислений предпочтителен `foreach`.
- `using` и `await using` для корректного освобождения ресурса (`IDisposable`/`IAsyncDisposable`).

```csharp
switch (command)
{
    case "help":
        PrintHelp();
        break;
    case "exit" when user.IsAdmin:
        Shutdown();
        break;
    default:
        Console.WriteLine("Неизвестная команда");
        break;
}
```

---

## 7. Работа с объектами и модульностью
### 7.1 Классы, структуры, записи
- `class` — ссылочный тип, наследование, виртуальные члены.
- `struct` — значимый тип (копируется по значению), подходит для небольших immutable моделей.
- `record` / `record struct` — типы с автоматическим `Equals`, `GetHashCode`, `with` для копирования.

```csharp
public record Order(Guid Id, decimal Amount)
{
    public string Status { get; init; } = "Pending";
}
```

### 7.2 Интерфейсы и абстракции
- Интерфейс описывает контракт (`IGreeter`), классы реализуют его и могут подставляться через DI.
- Используйте `internal` для скрытия деталей внутри сборки, `public` только для внешнего API.

### 7.3 Пространства имён и файлы
- C# 10 поддерживает **файловые пространства имён**:
  ```csharp
  namespace Project.Web;
  public class Startup { /* ... */ }
  ```
- Выделяйте один публичный тип на файл — легче поддерживать.

---

## 8. Nullability и безопасность типов
- Включите `nullable` в `.csproj`:
  ```xml
  <PropertyGroup>
    <Nullable>enable</Nullable>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  </PropertyGroup>
  ```
- `T?` — потенциально `null` (для ссылочных типов), `ArgumentNullException.ThrowIfNull(obj);` — быстрая проверка.
- `??` и `??=` — операторы объединения с null.
- Избегайте подавления (`!`) — он отключает статическую проверку.

```csharp
string? input = Console.ReadLine();
int length = input?.Length ?? 0;
```

---

## 9. Управление памятью и высокопроизводительные структуры
- За память отвечает GC, но важно вовремя освобождать unmanaged ресурсы (`SqlConnection`, `FileStream`). Используйте `using var stream = ...;`.
- `Span<T>` / `Memory<T>` — работа с непрерывными участками памяти без выделений на куче (выполняется на стекe).
- `ArrayPool<T>.Shared.Rent` — повторное использование буферов для снижения давления на GC.
- Следите за коробками (`boxing`). Пример: `struct` в `List<object>` приводит к частым выделениям.

---

## 10. Коллекции, LINQ и запросы
- Базовые коллекции: `List<T>`, `Dictionary<TKey,TValue>`, `HashSet<T>`, `Queue<T>`, `ConcurrentDictionary<T>` для многопоточности.
- LINQ (`System.Linq`) — декларативная обработка данных.

```csharp
var report = invoices
    .Where(x => x.DueDate <= DateOnly.FromDateTime(DateTime.UtcNow))
    .GroupBy(x => x.CustomerId)
    .Select(g => new { Client = g.Key, Total = g.Sum(x => x.Amount) })
    .OrderByDescending(x => x.Total)
    .ToList();
```

### Рекомендации
- Для больших объёмов данных используйте `AsEnumerable`, `AsAsyncEnumerable`, `ToHashSet` для быстрых проверок.
- Избегайте `ToList()` в конце цепочки, если можно обработать последовательность лениво.
- Для сложных фильтров в EF Core пишите выражения (`Expression<Func<TEntity,bool>>`).

---

## 11. Универсальные шаблоны (generics) и constraints
- Generics позволяют писать переиспользуемый код: `Task<T>`, `List<T>`, `ILogger<T>`.
- Ограничения (`where`) задают требования:
  ```csharp
  public T CreateOrDefault<T>() where T : class, new() => new();
  public bool IsDefault<T>(T value) where T : struct => value.Equals(default);
  ```
- Generic math (C# 11) — `where T : INumber<T>` для работы с арифметикой.

---

## 12. Исключения, логирование и контракт API
- Базовые исключения: `ArgumentException`, `InvalidOperationException`, `NotSupportedException`. Создавайте свои, наследуясь от `Exception`.
- Используйте guard clauses:
  ```csharp
  if (amount <= 0)
      throw new ArgumentOutOfRangeException(nameof(amount));
  ```
- Логирование через `ILogger<T>` (Microsoft.Extensions.Logging). Настройте уровни (`Information`, `Warning`, `Error`) и провайдеры (Console, Seq, Application Insights).
- Документируйте контракты публичных методов XML-комментариями (`///`). Анализаторы могут требовать документацию для публичного API.

---

## 13. Асинхронность, потокобезопасность, параллелизм
- `async/await` с `Task`/`ValueTask`. Никогда не используйте `async void`, кроме событий WPF/WinForms.
- Отмену операций обеспечивают `CancellationToken`. Передавайте его в I/O методы.
- Для CPU-операций используйте `Parallel.For`, `Parallel LINQ`, `Task.Run` (но избегайте для I/O).
- Библиотеки: `System.Threading.Channels` (очереди), `TPL Dataflow` (потоки обработки).

```csharp
public async Task<string> DownloadAsync(HttpClient client, string url, CancellationToken token)
{
    using var response = await client.GetAsync(url, token);
    response.EnsureSuccessStatusCode();
    return await response.Content.ReadAsStringAsync(token);
}
```

---

## 14. Работа с файлами, сетью и сериализацией
- Файлы: `File`, `FileInfo`, `Directory`, `Path`.
- Потоки: `FileStream`, `StreamReader`, `StreamWriter`, `BinaryReader`.
- JSON: `System.Text.Json` (по умолчанию), альтернативы — `Newtonsoft.Json`, `YamlDotNet`.
- HTTP: `HttpClient` (используйте `IHttpClientFactory` для переиспользования сокетов), `HttpRequestMessage`, `Polly` для ретраев.

```csharp
var data = new User { Name = "Ann", Age = 28 };
await File.WriteAllTextAsync("user.json", JsonSerializer.Serialize(data, new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    WriteIndented = true
}));
```

---

## 15. Dependency Injection и конфигурация
- В ASP.NET Core встроенный контейнер DI:
  ```csharp
  builder.Services.AddScoped<IInvoiceService, InvoiceService>();
  builder.Services.Configure<PaymentOptions>(builder.Configuration.GetSection("Payment"));
  ```
- Профили конфигурации: `appsettings.json`, `appsettings.Development.json`, переменные среды, `UserSecrets` (для локальных секретов).
- Используйте `Options pattern` (`IOptionsSnapshot<T>` для scoped, `IOptionsMonitor<T>` для singleton).

---

## 16. Веб‑разработка на ASP.NET Core
- Шаблоны: Minimal API, MVC, Razor Pages, gRPC, SignalR.
- Middlewares обрабатывают запросы по цепочке (`UseRouting`, `UseAuthentication`, `UseAuthorization`). Можно писать свои.
- Атрибуты для MVC: `[HttpGet("orders/{id}")]`, [FromQuery], [FromBody].
- Swagger (`dotnet add package Swashbuckle.AspNetCore`) — автогенерация документации.
- Identity — готовая модель аутентификации с поддержкой JWT, OAuth.

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();

app.MapGet("/ping", () => Results.Ok(new { ok = true }));

app.Run();
```

---

## 17. Работа с данными: EF Core и альтернативы
- EF Core — ORM от Microsoft. Описываем DbContext + DbSet, миграции (`dotnet ef migrations add Init`).
- Лучшие практики: `AsNoTracking` для чтения, `Include` / `ThenInclude` для навигационных свойств, `SplitQuery` для больших графов.
- Для сложных сценариев — Dapper (минималистичный ORM) или `DbCommand` напрямую.
- Рассмотрите реляционные и нереляционные провайдеры: SQL Server, PostgreSQL, Cosmos DB, SQLite.

---

## 18. Тестирование
- **Модульные тесты**: xUnit, NUnit, MSTest. Используйте `FluentAssertions` для выразительных утверждений.
- **Интеграционные тесты**: `WebApplicationFactory<TEntryPoint>` для ASP.NET Core, `Testcontainers` для запуска БД в Docker.
- **BDD**: SpecFlow (аналог Cucumber), подход Given-When-Then.
- Запуск: `dotnet test --collect:"XPlat Code Coverage"`.

```csharp
public class CalculatorTests
{
    [Fact]
    public void Add_ReturnsSum()
    {
        var calc = new Calculator();
        calc.Add(2);
        calc.Add(3);
        calc.Value.Should().Be(5);
    }
}
```

---

## 19. Контроль качества кода
- Форматирование: `dotnet format`, StyleCop Analyzers, Roslyn Analyzers, `EditorConfig`.
- Статический анализ: `SonarLint`, `SecurityCodeScan`, `FxCop`.
- Pact tests / контрактные тесты для сервисов.
- Code Coverage (`Coverlet`), Mutation testing (`Stryker.NET`).

---

## 20. Сборка, упаковка и деплой
- `dotnet build` — компиляция, `dotnet publish` — подготовка к деплою:
  ```bash
  dotnet publish -c Release -r linux-x64 --self-contained true /p:PublishReadyToRun=true
  ```
- **Self-contained** — включает рантайм, работает без установленного .NET. Увеличивает размер пакета.
- **Framework-dependent** — меньший размер, требует установленного рантайма.
- Docker:
  ```dockerfile
  FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
  WORKDIR /app
  COPY publish ./
  ENTRYPOINT ["dotnet", "MyApp.dll"]
  ```
- CI/CD: GitHub Actions (`actions/setup-dotnet`), Azure DevOps Pipelines, GitLab CI, Jenkins.

---

## 21. Диагностика, логирование, мониторинг
- Локально используйте `dotnet trace`, `dotnet dump`, `dotnet counters` для расследования проблем.
- Профилирование: **PerfView**, **Visual Studio Diagnostic Tools**, **JetBrains dotTrace**, **BenchmarkDotNet** (для микробенчмарков).
- Наблюдаемость в продакшне: OpenTelemetry (traces + metrics), Prometheus/Grafana, Elastic Stack, Application Insights.
- Логи организуйте по кореляционным ID (`using var scope = logger.BeginScope(new { RequestId = id });`).

---

## 22. Типичные ошибки и анти‑паттерны
1. **Использование `async void`** — не отлавливаются исключения, нарушает жизненный цикл. Всегда возвращайте `Task`.
2. **`HttpClient` на каждый запрос** — приводит к исчерпанию сокетов. Используйте `IHttpClientFactory` или singleton.
3. **Игнорирование `ConfigureAwait(false)` в библиотечных классах** — при работе в UI-приложениях может привести к deadlock.
4. **`DateTime.Now` вместо `DateTime.UtcNow`** — проблемы с часовыми поясами. Внедряйте `IDateTimeProvider`.
5. **Логика в конструкторах** — сложность тестирования, неожиданные исключения. Инициализируйте через методы или фабрики.
6. **Магические строки/числа** — используйте константы, enum, options.
7. **Преждевременная оптимизация** — например, излишнее использование `Span<T>` без измерений. Сначала измеряйте, потом улучшайте.

---

## 23. Дорожная карта изучения
1. **База**: синтаксис C#, управление памятью, основные коллекции.
2. **OOP и паттерны**: SOLID, DI, Unit of Work, Repository, CQRS.
3. **Асинхронность**: `async/await`, обработка в ASP.NET Core, очереди (Azure Service Bus, RabbitMQ).
4. **Работа с данными**: SQL, EF Core, Dapper, миграции.
5. **Инфраструктура**: Docker, Kubernetes, облачные провайдеры (Azure, AWS).
6. **Engineering culture**: тестирование, код-ревью, CI/CD, observability.
7. **Продвинутые темы**: Source Generators, Minimal APIs, gRPC, MAUI/Xamarin, Unity.

---

## 24. Ресурсы для продолжения
- Книги: *C# in Depth* (Jon Skeet), *Pro ASP.NET Core*, *CLR via C#* (Jeffrey Richter).
- Документация: [learn.microsoft.com/dotnet](https://learn.microsoft.com/dotnet), [dotnet/api](https://learn.microsoft.com/dotnet/api).
- Практика: **Advent of Code**, **LeetCode** (для алгоритмов), **dotnet playgrounds**, pet‑проекты на GitHub.
- Сообщества: DotNext, .NET Foundation, Telegram‑чаты и Stack Overflow.

> Освойте основные темы, подготовьте pet‑project, разверните его в Docker и подключите CI — это хороший набор навыков для первого junior‑уровня.
