# Компендим по Swift

Основы языка Swift и экосистемы Apple: установка, синтаксис, работа с Xcode, Swift Package Manager, SwiftUI/UIKit, асинхронность и тестирование. Подходит для начинающих разработчиков iOS/macOS.

---

## 1. Подготовка окружения
- **Xcode** — основная IDE для Swift. Установите из App Store (macOS 12+).
- После установки добавьте командные инструменты:
  ```bash
  xcode-select --install
  ```
- Проверка:
  ```bash
  swift --version
  swiftc --version
  ```
- Swift Package Manager (SPM) встроен: `swift package init`, `swift build`, `swift test`, `swift run`.
- Для обучения можно использовать Swift Playgrounds (iPad, macOS) или онлайн-песочницы.

---

## 2. Структура проекта
- **SPM**:
  ```
  Package.swift
  Sources/
    MyApp/main.swift
  Tests/
    MyAppTests/MyAppTests.swift
  ```
- **Xcode**:
  - `.xcodeproj` или `.xcworkspace`.
  - Target (приложение, тесты, виджеты).
  - Scheme — набор настроек сборки/запуска.
  - Build settings, Info.plist, Assets.xcassets.

---

## 3. Синтаксис и типы
- Примитивы: `Int`, `Double`, `Float`, `Bool`, `String`, `Character`.
- Коллекции: `Array<Element>`, `Dictionary<Key, Value>`, `Set<Element>`.
- Кортежи: `(name: String, age: Int)`.
- Оператор `?` для optional (`String?`), `!` — принудительное разворачивание.
- Интроспекция типов: `type(of:)`, `is`, `as?`, `as!`.

```swift
let numbers = [1, 2, 3]
let squared = numbers.map { $0 * $0 }
```

---

## 4. Управляющие конструкции
- `if`, `guard`, `switch`, `for-in`, `while`, `repeat-while`.
- `switch` должен быть исчерпывающим, поддерживает диапазоны, `where`.
```swift
switch score {
case 90...100:
    print("A")
case 80..<90:
    print("B")
default:
    print("C или ниже")
}
```
- `guard` используется для раннего выхода (early return).

---

## 5. Optionals и безопасное разворачивание
- `if let`, `guard let`, `nil`-коалесцент `??`.
- Связывание:
  ```swift
  guard let url = URL(string: path) else {
      return
  }
  ```
- Optional chaining: `person?.address?.city`.
- `??` для значений по умолчанию: `text ?? ""`.

---

## 6. Функции и замыкания
- Объявление:
  ```swift
  func greet(_ name: String, from city: String = "Москва") -> String {
      "Привет, \(name) из \(city)"
  }
  ```
- Замыкания (closures):
  ```swift
  let sorted = names.sorted { $0 < $1 }
  ```
- Escaping closures (`@escaping`) — сохраняются после выхода из функции.
- `@autoclosure` — ленивые выражения.

---

## 7. Структуры, классы, перечисления
- **Struct** — value type (copy-on-write), рекомендуется для моделей.
- **Class** — reference type, поддерживает наследование, требует `init`.
- **enum** — обобщённые перечисления, ассоциированные значения, рекурсивные кейсы.

```swift
struct User {
    var name: String
    var age: Int
}

enum NetworkState {
    case idle
    case loading
    case success(Data)
    case failure(Error)
}
```

---

## 8. Протоколы и расширения
- Протоколы описывают интерфейсы:
  ```swift
  protocol Greeter {
      func greet() -> String
  }
  ```
- `extension` расширяет существующие типы.
- Протоколы с ассоциированными типами (`associatedtype`).
- Протоколы можно комбинировать (`protocol A: B, C`).
- Используйте протоколы для DI и тестирования (mocking).

---

## 9. Свойства и наблюдатели
- Stored properties (хранящиеся), computed properties (вычисляемые).
- `didSet`, `willSet`:
  ```swift
  var progress: Int = 0 {
      didSet {
          print("progress changed to \(progress)")
      }
  }
  ```
- Ленивая инициализация: `lazy var`.

---

## 10. Generics
- Универсальные типы и функции:
  ```swift
  func swapValues<T>(_ a: inout T, _ b: inout T) {
      let temp = a
      a = b
      b = temp
  }
  ```
- Ограничения (`where T: Equatable`), протоколы с ассоциированными типами (`associatedtype`).
- `some` keyword для opaque types (элементы, реализующие протокол).

---

## 11. Обработка ошибок
- `Error` протокол, `throw`, `try`, `catch`.
- `try?` — возвращает optional, `try!` — crash при ошибке.
- Пользовательские ошибки:
  ```swift
  enum NetworkError: Error {
      case badURL
      case requestFailed(Int)
  }
  ```
- `do { try ... } catch { ... }` и `defer` для освобождения ресурсов.

---

## 12. Асинхронность: async/await и concurrency
- Swift 5.5+ (iOS 15+):
  ```swift
  func fetchUser() async throws -> User {
      let (data, _) = try await URLSession.shared.data(from: url)
      return try JSONDecoder().decode(User.self, from: data)
  }
  ```
- `Task`, `TaskGroup`, `async let`, `await`.
- Actors — изоляция состояния (`actor Counter { var value = 0 }`).
- При работе со старым API — `withCheckedContinuation`.
- Combine и AsyncSequence для реактивного программирования.

---

## 13. Swift Package Manager
- Создание пакета: `swift package init --type executable|library`.
- `Package.swift` описывает зависимости:
  ```swift
  // swift-tools-version: 6.0
  import PackageDescription

  let package = Package(
      name: "App",
      platforms: [.iOS(.v15), .macOS(.v13)],
      products: [
          .executable(name: "App", targets: ["App"])
      ],
      dependencies: [
          .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0")
      ],
      targets: [
          .executableTarget(
              name: "App",
              dependencies: ["Alamofire"]
          ),
          .testTarget(
              name: "AppTests",
              dependencies: ["App"]
          )
      ]
  )
  ```
- Xcode автоматически интегрирует SPM-зависимости.
- Переиспользование модулей между iOS/macOS/CLI.

---

## 14. Тестирование
- XCTest — стандартная библиотека тестов.
  ```swift
  import XCTest
  @testable import App

  final class UserServiceTests: XCTestCase {
      func testLoadUser() async throws {
          let service = UserService()
          let user = try await service.load(id: 1)
          XCTAssertEqual(user.name, "Ann")
      }
  }
  ```
- Snapshot тесты (iOS): `iOSSnapshotTestCase`, `SnapshotTesting`.
- UI тесты: XCUITest.
- Mocking: протоколы + fake реализации, библиотеки `Cuckoo`, `Mockingbird`.

---

## 15. Разработка под iOS/macOS
### 15.1 SwiftUI
- Декларативный UI:
  ```swift
  struct ContentView: View {
      @State private var counter = 0

      var body: some View {
          VStack {
              Text("Counter: \(counter)")
              Button("Increment") {
                  counter += 1
              }
          }
      }
  }
  ```
- Навигация (`NavigationStack`), состояния (`@State`, `@Binding`, `@ObservedObject`, `@EnvironmentObject`).
- Combine + SwiftUI (`@StateObject` + `ObservableObject`).

### 15.2 UIKit
- ViewController, Storyboards/XIBs, AutoLayout, constraints.
- DI и архитектура: MVC, MVVM, VIPER, Clean Swift.
- Координаторы для управления навигацией.

### 15.3 Инструменты
- Instruments: Time Profiler, Allocations, Energy, Leaks.
- Crash аналитика: Xcode Organizer, Firebase Crashlytics, Sentry.
- Локализация (`Localizable.strings`), accessibility.

---

## 16. Работа с сетью и данными
- URLSession, async/await, Combine publishers.
- Alamofire (HTTP abstraction).
- JSON: `Codable`, `JSONDecoder/Encoder`.
- Core Data, Realm, SQLite.
- UserDefaults/Keychain для безопасного хранения настроек/секретов.

---

## 17. CI/CD и деплой
- Fastlane — автоматизация (сборка, тесты, подпись, публикация).
- Xcode Cloud, GitHub Actions, Bitrise, Jenkins.
- Сертификаты и профили: Apple Developer Program, App Store Connect.
- TestFlight для внутреннего/внешнего бета-тестирования.

---

## 18. Типичные ошибки
1. **Force unwrap (`!`)** — приводит к crash. Используйте безопасные методы (`guard let`, `if let`).
2. **Логика в View** — переносите бизнес-логику в ViewModel/Service.
3. **Retain cycles** — замыкания сохраняют сильную ссылку. Используйте `[weak self]`.
4. **Отсутствие unit тестов** — сложно поддерживать масштабируемость.
5. **Игнорирование Main Thread** — UI должен обновляться на главном потоке (`DispatchQueue.main.async`).
6. **Смешение SwiftUI и UIKit без координации** — используйте `UIHostingController` и `UIViewRepresentable`.
7. **Неправильная работа с `async/await`** — не забывайте `await`, обрабатывайте ошибки.

---

## 19. Дорожная карта изучения
1. Изучите базовый синтаксис Swift (коллекции, классы, Optionals, протоколы).
2. Напишите CLI-программы с SPM.
3. Создайте iOS приложение на SwiftUI (список заметок, ToDo).
4. Реализуйте сеть (URLSession), парсинг JSON, сохранение данных.
5. Освойте архитектуру (MVVM, coordinator), тестирование (XCTest).
6. Изучите Swift Concurrency и Combine.
7. Внедрите CI/CD (Fastlane + GitHub Actions), добавьте Crashlytics/анализ perf.

---

## 20. Ресурсы
- Документация: [developer.apple.com/documentation/swift](https://developer.apple.com/documentation/swift/).
- Книги: *Swift Programming: The Big Nerd Ranch Guide*, *SwiftUI by Tutorials*, *Combine: Asynchronous Programming with Swift*.
- Курсы: Hacking with Swift, Stanford CS193p (iOS), Ray Wenderlich.
- Сообщества: Swift Forums, iOS Developers Slack, Reddit r/Swift, телеграм-чаты iOS.
- Практика: Swift Playgrounds, LeetCode (раздел Swift), Pet-проекты.

> Swift быстро развивается: следите за новыми версиями языка и фреймворков, обновляйте навыки асинхронности и архитектуры. Регулярно практикуйтесь на проектах, покрывайте код тестами и автоматизируйте сборку — это поможет стать профессиональным iOS-разработчиком.
