# Компендим по Kotlin

Расширенный конспект по языку Kotlin: установка, базовый синтаксис, null‑безопасность, корутины, работа с Gradle, Android и серверными фреймворками. Подходит для новичков и разработчиков, переходящих с Java.

---

## 1. Установка и окружение
- **JDK**: рекомендуется Temurin или Liberica, версия 17+. Проверка: `java -version`.
- **Kotlin Compiler**: поставляется с IntelliJ IDEA / Android Studio. CLI: `curl -s https://get.sdkman.io | bash` → `sdk install kotlin`.
- **Gradle**: `curl -s https://get.sdkman.io | bash` → `sdk install gradle`. Модули Kotlin DSL (`build.gradle.kts`).
- Проверка CLI:
  ```bash
  kotlinc main.kt -include-runtime -d app.jar
  java -jar app.jar
  ```
- Для быстрых экспериментов используйте `kotlinc -script script.kts` или онлайн-песочницу [play.kotlinlang.org](https://play.kotlinlang.org/).

---

## 2. Структура проекта
- `build.gradle.kts` — конфигурация сборки.
- `settings.gradle.kts` — список модулей.
- `src/main/kotlin` — исходный код.
- `src/test/kotlin` — тесты.
- `gradlew`, `gradlew.bat` — wrapper (обязательно коммитим в репозиторий).
- Пример `build.gradle.kts`:
  ```kotlin
  plugins {
      kotlin("jvm") version "2.0.0"
      application
  }

  repositories {
      mavenCentral()
  }

  dependencies {
      implementation(kotlin("stdlib"))
      testImplementation(kotlin("test"))
  }

  application {
      mainClass.set("com.example.AppKt")
  }
  ```

---

## 3. Основы языка
- Типы: `Int`, `Long`, `Double`, `Boolean`, `String`, `Char`.
- Неявная конвертация отсутствует: `val x: Long = 42` требует `42L` или `42.toLong()`.
- Операторы: `==` (структурное сравнение), `===` (сравнение ссылок).
- Интерполяция строк: `"Привет, $name"`.
- Многострочные строки: `"""text"""`.
- `val` — неизменяемая ссылка, `var` — изменяемая.
- `lateinit var` — отложенная инициализация (только для ссылочных типов).

```kotlin
val sum = (1..10).sum()
val hello = buildString {
    append("Hello, ")
    append("Kotlin")
}
```

---

## 4. Управляющие конструкции
- `if` — выражение, может возвращать значение.
- `when` — расширенная версия `switch`, поддерживает диапазоны, условия, захват переменных.
- Циклы: `for`, `while`, `do..while`. Для коллекций используйте функции высшего порядка (`forEach`, `map`, `filter`).
- `try` тоже выражение и возвращает значение.

```kotlin
val sizeCategory = when (val size = files.size) {
    in 0..10 -> "small"
    in 11..1_000 -> "medium"
    else -> "large"
}
```

---

## 5. Null‑безопасность
- Nullable типы: `String?`.
- Операторы:
  - `?.` — безопасный вызов.
  - `?:` — Elvis (значение по умолчанию).
  - `!!` — небезопасный каст (бросит `NullPointerException`).
- Функции scope: `let`, `run`, `also`, `apply`, `takeIf`.

```kotlin
val message: String? = readLine()
val length = message?.length ?: 0

message?.let { println(it.uppercase()) }
```

---

## 6. Функции и лямбды
- Синтаксис:
  ```kotlin
  fun greet(name: String, greeting: String = "Hello"): String =
      "$greeting, $name!"
  ```
- Расширения: `fun String.isValidEmail(): Boolean`.
- Функции высшего порядка:
  ```kotlin
  fun operate(numbers: List<Int>, action: (Int) -> Unit) {
      numbers.forEach(action)
  }
  ```
- `inline` — оптимизация для высокочастотных вызовов (избегает создания объектов-лямбд).
- `tailrec` — хвостовая рекурсия.

---

## 7. Коллекции и последовательности
- Неизменяемые: `listOf`, `setOf`, `mapOf`. Изменяемые: `mutableListOf`, `mutableSetOf`.
- Функции: `map`, `filter`, `fold`, `groupBy`, `associate`, `flatMap`, `zip`.
- `Sequence` — ленивые операции (как Streams в Java).
- `chunked`, `windowed` — работа с батчами.
- Используйте `collection.joinToString()` для форматирования.

---

## 8. Классы и модификаторы
- Обычные классы, `open` для наследования.
- Свойства: `val/var`, пользовательские геттеры/сеттеры.
- Вторичные конструкторы + `init`.
- `data class` — автоматически генерирует `equals`, `hashCode`, `copy`, `componentN`.
- `sealed class` — ограниченная иерархия, удобно для state-машин.
- `enum class` — перечисления, поддерживают поля и методы.

```kotlin
sealed interface UiState {
    data object Loading : UiState
    data class Success(val data: List<String>) : UiState
    data class Error(val cause: Throwable) : UiState
}
```

---

## 9. Объекты и companion
- `object` — синглтон (`object ApiClient { ... }`).
- `companion object` — статические члены класса.
- Анонимные объекты: `val listener = object : OnClickListener { ... }`.
- Делегирование: `class RepositoryImpl(private val api: Api) : Repository by api`.

---

## 10. Generics и variance
- Объявление: `class Box<T>(val value: T)`.
- Ограничения: `fun <T : Number> sum(items: List<T>)`.
- Ковариантность (`out`), контравариантность (`in`):
  ```kotlin
  interface Producer<out T> { fun produce(): T }
  interface Consumer<in T> { fun consume(item: T) }
  ```
- Reified типы в inline-функциях: `inline fun <reified T> Gson.fromJson(json: String): T`.

---

## 11. Коррутины и асинхронность
- Библиотека `kotlinx.coroutines`.
- Структурная конкурентность:
  ```kotlin
  suspend fun fetchData(): Result {
      return withContext(Dispatchers.IO) {
          api.load()
      }
  }
  ```
- `launch`, `async/await`, `SupervisorJob`, `CoroutineScope`.
- Обработка исключений: `CoroutineExceptionHandler`.
- `withTimeout`, `withTimeoutOrNull`.

### Flow
- Холодный поток данных:
  ```kotlin
  fun notifications(): Flow<Notification> = flow {
      while (true) {
          emit(fetch())
          delay(1_000)
      }
  }
  ```
- Операции: `map`, `filter`, `debounce`, `buffer`, `conflate`, `stateIn`, `shareIn`.
- Для UI (Jetpack Compose, Android) используйте `StateFlow`, `SharedFlow`.

---

## 12. Работа с файлами и сетью
- Файлы: `java.nio.file`, `kotlin.io`. Чтение/запись текстовых файлов (`File("data.txt").readText()`).
- JSON: `kotlinx.serialization`, `Moshi`, `Jackson`. Пример:
  ```kotlin
  @Serializable
  data class Item(val id: Int, val name: String)

  val json = Json { ignoreUnknownKeys = true }
  val data = json.decodeFromString<List<Item>>(payload)
  ```
- HTTP: Ktor client, OkHttp.
- Базы данных: Exposed (DSL), Jetpack Room (Android), Ktorm, Hibernate (через Spring).

---

## 13. Логирование и обработка ошибок
- Исключения: `throw IllegalArgumentException("...")`, `try/catch/finally`.
- Оптимальный подход — завернуть в Result:
  ```kotlin
  fun loadUser(id: String): Result<User> = runCatching {
      userService.fetch(id)
  }
  ```
- Логирование: `Kotlin Logging`, `SLF4J`, `Logback`.
- В Android — `Logcat`, Timber.

---

## 14. Тестирование
- **JUnit 5** + `kotlin("test")`.
- **Mockk**, **Kotest**, **Strikt**.
- Пример:
  ```kotlin
  class MathTest {
      @Test
      fun add() {
          assertEquals(5, 2 + 3)
      }
  }
  ```
- Коррутины: `runTest { ... }`, `TestDispatcher`, `TestScope`.
- Property-based: `kotest-property`.
- Snapshot testing: `shot`, `karumi/shot` (Android).

---

## 15. Gradle и управление зависимостями
- Kotlin DSL позволяет использовать проверку типов:
  ```kotlin
  dependencies {
      implementation(platform("org.jetbrains.kotlin:kotlin-bom"))
      implementation("io.ktor:ktor-server-netty:3.0.0")
      testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
  }
  ```
- Настраивайте `jvmToolchain(17)` для единообразия.
- Скрипты: `./gradlew clean build`, `./gradlew test`, `./gradlew ktlintCheck`.
- Линтеры: `ktlint`, `detekt`.

---

## 16. Серверные фреймворки
- **Ktor** — лёгкий асинхронный фреймворк от JetBrains.
  - Настройка DI (Koin, Kodein), serialization, routing.
- **Spring Boot (Kotlin DSL)** — Java стек с Kotlin расширениями.
- **Micronaut**, **Quarkus** — микросервисные фреймворки.
- **Arrow** — функциональные расширения (Either, Validated, Option).

---

## 17. Android разработка
- Android Studio, Gradle, Jetpack Compose, View Binding.
- Стек: Kotlin coroutines, Flow, Room, Retrofit, Hilt.
- Архитектура: MVVM, MVI, Clean Architecture.
- Инструменты: Android Profiler, LeakCanary, Firebase Crashlytics.
- Jetpack Compose + coroutines: `collectAsStateWithLifecycle`, `rememberCoroutineScope`.

---

## 18. Kotlin Multiplatform
- Общая бизнес-логика на Kotlin, платформенные реализации для Android/iOS/JS/Native.
- Структура: `shared/`, `androidApp/`, `iosApp/`.
- Инструменты: KMM, Ktor, SQLDelight, Koin.
- Пример общих expect/actual:
  ```kotlin
  expect fun platformName(): String

  actual fun platformName(): String = "Android ${Build.VERSION.SDK_INT}"
  ```

---

## 19. Типичные ошибки и best practices
1. **Использование `!!`** — избегайте, лучше обрабатывайте nullable значения.
2. **Непонимание жизненного цикла корутин** — всегда привязывайте `CoroutineScope` к жизненному циклу компонента (ViewModel, Activity).
3. **Загрязнение глобального пространства** — используйте пакеты и модульную архитектуру.
4. **Медленный Gradle** — включайте параллельную сборку (`org.gradle.parallel=true`), конфигурацию `configuration cache`.
5. **Логика в init блоках** — перемещайте в функции или DI.
6. **Отсутствие `sealed` для состояний** — приводите UI state к структурированным иерархиям.
7. **Смешение бизнес-логики и UI** — разделяйте слои (UseCases, Repository).

---

## 20. Дорожная карта изучения
1. Пройдите базовый курс Kotlin (официальная документация, Kotlin Koans).
2. Напишите CLI-приложение или консольный инструмент.
3. Освойте корутины и Flow (асинхронность).
4. Создайте REST API на Ktor или Spring Boot с Kotlin.
5. Реализуйте Android-приложение с Jetpack Compose.
6. Изучите Kotlin Multiplatform, напишите общую библиотеку.
7. Покройте проект тестами (unit + integration), настройте CI, публикацию артефактов.

---

## 21. Ресурсы
- Документация: [kotlinlang.org/docs](https://kotlinlang.org/docs/home.html).
- Книги: *Kotlin in Action*, *Kotlin Programming: The Big Nerd Ranch Guide*.
- Курсы: JetBrains Academy, Udemy, Coursera (Android/Kotlin).
- Практика: Kotlin Koans, Advent of Kotlin, Katas (codewars).
- Сообщества: Kotlin Slack, Kotlinlang forums, Kotlin Weekly.

> Kotlin отлично сочетается с современными практиками: функциональный стиль, асинхронность и тестирование. Регулярно тренируйтесь, читайте исходники библиотек и поддерживайте код-стиль — так вы быстрее освоите язык и экосистему.
