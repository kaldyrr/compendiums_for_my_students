# Курс‑компендиум по C# (практический старт)

Плотный и понятный гид по современному C#: от консоли до веб‑API.

## Раздел 1. Для кого и предпосылки
- Бэкенд, desktop, игры (Unity), кроссплатформенная разработка на .NET.
- Понадобится .NET SDK и VS Code/Visual Studio/Rider.

## Раздел 2. Окружение и инструменты
- Проверка: `dotnet --info`. Новая консоль: `dotnet new console -n Demo && cd Demo && dotnet run`.
- Пакеты NuGet: `dotnet add package Newtonsoft.Json`.
- Форматирование/анализ: `dotnet format`, Roslyn analyzers, StyleCop.

## Раздел 3. Структура решения и проектов
- `.sln` — решение; `.csproj` — проект. Топ‑левел программы или `Program.Main`.
```csharp
namespace App; class Program { static void Main() => System.Console.WriteLine("Run"); }
```

## Раздел 4. Типы, null‑аннотации, записи
- Базовые: `int`, `double`, `bool`, `string`, `decimal`, `DateTime`.
- Включите nullable: `<Nullable>enable</Nullable>` в `.csproj` → предупреждения для `string?`.
- Неизменяемые модели через `record`.
```csharp
public record Person(string Name, int Age);
```

## Раздел 5. Коллекции и Span/Memory
- `List<T>`, `Dictionary<K,V>`, `HashSet<T>`, `Queue/Stack`.
- Высокопроизводительные срезы: `Span<T>`, `ReadOnlySpan<T>` для работы с массивами/строками без аллокаций.

## Раздел 6. Управляющие конструкции и сопоставление с образцом
- `switch`‑выражения, `when`, деконструкции.
```csharp
object x = 42; var msg = x switch { int n when n>0 => "+", _ => "?" };
```

## Раздел 7. Методы, параметры и локальные функции
- `ref`, `in`, `out`, значения по умолчанию, локальные функции внутри метода.
```csharp
int Add(int a, int b = 1) => a + b; // локально
```

## Раздел 8. ООП и интерфейсы
- Наследование/композиция, интерфейсы по контракту, `IEnumerable<T>`, `IAsyncDisposable`.
```csharp
public interface IGreeter { string Hello(string name); }
public record Person(string Name, int Age) : IGreeter { public string Hello(string n) => $"Hi {n}, I'm {Name}"; }
```

## Раздел 9. Исключения и правила
- Перехват `try/catch/finally`, собственные типы, не злоупотреблять исключениями в контроле потока.

## Раздел 10. LINQ — декларативные операции над коллекциями
- `Where/Select/OrderBy/GroupBy/Aggregate`, `AsParallel` (PLINQ).
```csharp
var xs = new[]{1,3,2,4}; var evens = xs.Where(x => x%2==0).Select(x=>x*x).ToList();
```

## Раздел 11. Файлы и сериализация
- `System.IO.*`, JSON: `System.Text.Json` (быстрый) или Newtonsoft.
```csharp
using System.Text.Json; var json = JsonSerializer.Serialize(new {a=1, b="x"}); File.WriteAllText("out.json", json);
```

## Раздел 12. Async/await и HttpClient
- `Task`, `async`/`await`, отмена через `CancellationToken`. Настройте `HttpClientFactory` в ASP.NET Core.
```csharp
using var http = new HttpClient{ Timeout = TimeSpan.FromSeconds(5) };
var s = await http.GetStringAsync("https://example.com");
```

## Раздел 13. Обобщения (generics) и ограничения
- Параметры типа, `where T: class, new()`, ковариантность/контравариантность в интерфейсах.
```csharp
T Id<T>(T x) => x;
```

## Раздел 14. Мини‑API на ASP.NET Core
- Шаблон: `dotnet new web -n Api`.
```csharp
var app = WebApplication.CreateBuilder(args).Build();
app.MapGet("/ping", () => Results.Json(new { ok = true }));
app.Run();
```

## Раздел 15. DI и конфигурация
- Встроенный контейнер служб, `IOptions<T>` для конфигов, `appsettings.json`.

## Раздел 16. Доступ к данным (EF Core кратко)
- DbContext, миграции, контракты репозиториев. Включите `AsNoTracking()` для чтения.

## Раздел 17. Тестирование (xUnit, NUnit, MSTest)
- `dotnet new xunit -n Tests`, `dotnet test`.
```csharp
using Xunit; public class MathTests { [Theory] [InlineData(2,3,5)] public void Add(int a,int b,int exp) => Assert.Equal(exp, a+b); }
```

## Раздел 18. Производительность
- Структуры/`ref struct`, `Span<T>`, `ArrayPool<T>`, source generators.
- Профилирование: PerfView, dotnet‑counters, BenchmarkDotNet.

## Раздел 19. Сборка и публикация
- `dotnet build`, `dotnet publish -c Release -r win-x64 --self-contained true`.

## Раздел 20. Частые подводные камни
- `async void` — только для обработчиков событий.
- `HttpClient` на каждый запрос — плохо: используйте фабрику/один экземпляр.
- Nullability: аннотируйте API, избегайте `!` без нужды.

## Раздел 21. Экосистема (выдержка)
- Веб: ASP.NET Core, Minimal APIs, gRPC.
- Данные: EF Core, Dapper; кэш: StackExchange.Redis.
- Тесты: xUnit + FluentAssertions.

## Раздел 22. Ресурсы и стиль
- «C# in Depth» (Skeet), документация docs.microsoft.com, Roslyn analyzers.
- `dotnet format` и EditorConfig для единого стиля.
