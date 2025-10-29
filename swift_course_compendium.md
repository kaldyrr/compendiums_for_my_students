# Курс‑компендиум по Swift

Современный язык Apple: безопасность типов, выразительность, производительность.

## Раздел 1. Инструменты
- `swift --version`, REPL, `swiftc`, Swift Package Manager (SPM).
- Проект: `swift package init --type executable`; запуск: `swift run`.

## Раздел 2. Типы и опционалы
- `Int`, `Double`, `Bool`, `String`, `Array`, `Dictionary`, `Set`.
- Опционалы `T?`, безопасное разворачивание `if let`/`guard let`, `!` избегать.
```swift
var maybe:String? = "hi"
if let s = maybe { print(s.count) }
```

## Раздел 3. Управляющие конструкции
- `if/else`, `switch` (мощные паттерны), циклы `for/while`, `guard`, `defer`.

## Раздел 4. Функции и замыкания
- Именованные параметры, значения по умолчанию, кортежи, trailing‑closure.
```swift
func add(_ a:Int, _ b:Int=1) -> Int { a+b }
let f: (Int,Int)->Int = { $0 + $1 }
```

## Раздел 5. Структуры, классы, протоколы, enum
- `struct` — value semantics (copy‑on‑write), `class` — reference.
- Протоколы, extensions, enum с ассоциированными значениями.
```swift
protocol Greeter { func hello(_ name:String)->String }
struct User: Greeter { let name:String; func hello(_ n:String)->String {"Hi \(n), I'm \(name)"}}
```

## Раздел 6. Коллекции и алгоритмы
- `Array`, `Dictionary`, `Set`, операции `map/filter/reduce/compactMap`.
```swift
let xs = [1,2,3,4]
let evens = xs.filter{ $0%2==0 }.map{ $0*$0 }
```

## Раздел 7. Ошибки
- `throw`, `try`, `catch`, `throws`, `try?` (опционал) и `try!` (краш).
```swift
enum MyErr: Error { case bad }
func risky(_ ok:Bool) throws -> String { if !ok { throw MyErr.bad }; return "ok" }
```

## Раздел 8. Дженерики
- Обобщение и ограничения `where`, протоколы с ассоциированными типами.
```swift
func first<T>(_ xs:[T]) -> T? { xs.first }
```

## Раздел 9. Конкурентность (Swift Concurrency)
- `async/await`, `Task`, `TaskGroup`, `Actor` для защиты состояния.
```swift
import Foundation
func ping() async throws -> Int {
  let (_, resp) = try await URLSession.shared.data(from: URL(string:"https://example.com")!)
  return (resp as! HTTPURLResponse).statusCode
}
```

## Раздел 10. Foundation и Codable
- Работа с файлами, JSON с `JSONEncoder/JSONDecoder`, стратегии дат/кейсов.
```swift
import Foundation
struct Item: Codable { let a:Int; let b:String }
let json = try JSONEncoder().encode(Item(a:1,b:"x"))
```

## Раздел 11. Пакеты (SPM)
- `Package.swift`, зависимости, таргеты, `swift test` для тестов.

## Раздел 12. Тестирование
- XCTest: тестовые таргеты в SPM/Xcode, асинхронные тесты `async`.

## Раздел 13. Следующие шаги
- SwiftUI/UIKit, Combine/AsyncSequence, серверный Swift (Vapor), ObjC interop.
