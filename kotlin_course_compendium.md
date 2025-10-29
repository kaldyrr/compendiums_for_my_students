# Курс‑компендиум по Kotlin

Лаконичный JVM‑язык с безопасностью null и корутинами.

## Раздел 1. Окружение и запуск
- JDK 17+, `kotlin -version`, `kotlinc`.
- Gradle (Kotlin DSL). Быстрый запуск: `kotlinc Main.kt -include-runtime -d app.jar && java -jar app.jar`.

## Раздел 2. Типы и null‑безопасность
- `Int`, `Double`, `Boolean`, `String`, `List`, `Map`, `Set`.
- Nullable `T?`, `?.`, `?:`, `!!` (избегать), `let`, `also`, `run`, `apply`, `with`.
```kotlin
val maybe: String? = "hi"
val len = maybe?.length ?: 0
```

## Раздел 3. Управляющие конструкции
- `if` как выражение, `when` (паттерны), циклы `for/while`.

## Раздел 4. Функции, лямбды и расширения
- Аргументы по умолчанию, именованные, функции‑расширения.
```kotlin
fun Int.sq(): Int = this*this
val add: (Int,Int)->Int = { a,b -> a+b }
```

## Раздел 5. Коллекции и последовательности
- Иммутабельные/мутабельные, `map/filter/reduce`, ленивые `sequence {}`.
```kotlin
val xs = listOf(1,2,3,4)
val evens = xs.filter{ it%2==0 }.map{ it*it }
```

## Раздел 6. Data/Sealed/Enum классы
- `data class` (equals/hashCode/toString), `sealed` иерархии и исчерпывающий `when`.
```kotlin
data class User(val name:String, val age:Int)
sealed class Shape{ data class Circle(val r:Double):Shape(); data class Rect(val w:Double,val h:Double):Shape() }
```

## Раздел 7. Наследование и интерфейсы
- `open` для наследования, интерфейсы с реализациями по умолчанию.

## Раздел 8. Дженерики
- Ограничения, ковариантность/контравариантность (`out/in`).
```kotlin
fun <T> first(xs: List<T>): T? = xs.firstOrNull()
```

## Раздел 9. Корутины
- `suspend`, `runBlocking`, `launch/async`, диспетчеры, отмена.
```kotlin
import kotlinx.coroutines.*
fun main() = runBlocking { val one = async { 21 }; println(one.await()*2) }
```

## Раздел 10. Потоки данных
- `Flow`, операторы (`map`, `filter`, `debounce`), `stateIn`, `shareIn`.

## Раздел 11. Файлы и JSON
- `java.nio.file`, kotlinx‑serialization/Moshi/Jackson.

## Раздел 12. Тестирование
- JUnit5/Kotest/MockK.
```kotlin
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
class MathTest { @Test fun add(){ assertEquals(5, 2+3) } }
```

## Раздел 13. Gradle
- `plugins { kotlin("jvm") }`, зависимости, `tasks.test` и `jvmToolchain(17)`.

## Раздел 14. Экосистема
- Backend: Ktor/Spring; мультиплатформа: Compose; Android; Arrow (функциональное).

## Раздел 15. Подводные камни
- Блокирующий код внутри корутин без диспетчера — старайтесь `withContext(Dispatchers.IO)`.
- Избегайте глобальных скоупов, используйте структурированную конкуррентность.
