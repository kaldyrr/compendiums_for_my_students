# Курс‑компендиум по Rust

Безопасность памяти, производительность и современный инструментарий.

## Раздел 1. Инструменты и установка
- `rustup` управляет тулчейнами: `rustup default stable`, `rustup update`.
- Создание: `cargo new app`, запуск: `cargo run`, тесты: `cargo test`.
- Формат/линт: `cargo fmt`, `cargo clippy`.

## Раздел 2. Базовые типы и переменные
- `let` — неизменяемо, `let mut` — изменяемо. Аннотации типов по необходимости.
- Типы: целые/вещественные (`i32/u64/f64`), `bool`, `char`, `&str`, `String`.
```rust
fn main(){ let mut x = 1; x += 1; println!("x={}", x); }
```

## Раздел 3. Управляющие конструкции
- `if/else`, `match`, `loop/while/for`, выражения возвращают значения.
```rust
for i in 0..3 { println!("{}", i); }
```

## Раздел 4. Владение, заимствование и времена жизни
- Move/Copy семантика, `&T` (shared), `&mut T` (mutable). Лайфтаймы появляются из контекста.
```rust
fn len(s: &String) -> usize { s.len() }
```

## Раздел 5. Option/Result, ошибки и `?`
- Явные варианты отсутствия/ошибки. `?` пробрасывает ошибку к вызывающему.
```rust
use std::fs; fn read() -> Result<String, std::io::Error> { Ok(fs::read_to_string("data.txt")?) }
```

## Раздел 6. Коллекции и хеш‑структуры
- `Vec<T>`, `HashMap<K,V>`, `HashSet<T>`, `VecDeque<T>`.
```rust
let mut xs = vec![1,2,3]; xs.push(4);
use std::collections::HashMap; let mut m = HashMap::new(); m.insert("a", 1);
```

## Раздел 7. Строки
- `&str` — срез, `String` — владение. Конвертация `s.to_string()`/`String::from`.

## Раздел 8. Структуры, enum и `match`
- Богатые перечисления и сопоставление с образцом.
```rust
enum Shape{ Circle(f64), Rect{w:f64,h:f64} }
fn area(s: &Shape) -> f64 { match s { Shape::Circle(r)=>3.14*r*r, Shape::Rect{w,h}=>w*h } }
```

## Раздел 9. Traits и дженерики
- Обобщение поведения, ограничения, ассоциированные типы.
```rust
fn first<T: Clone>(xs: &[T]) -> Option<T> { xs.get(0).cloned() }
```

## Раздел 10. Итераторы и адаптеры
- Ленивая обработка: `iter()`, `map`, `filter`, `collect`.
```rust
let xs = vec![1,2,3,4]; let evens: Vec<_> = xs.into_iter().filter(|x| x%2==0).collect();
```

## Раздел 11. Модули, пакеты и рабочие пространства
- `mod`, `pub`, `crate`, `Cargo.toml`, workspace для монорепо.

## Раздел 12. Async/await (Tokio/async‑std)
- `async fn`, `await`, executors. HTTP клиент через `reqwest`.
```rust
#[tokio::main]
async fn main(){ let s = reqwest::get("https://example.com").await.unwrap().text().await.unwrap(); println!("{}", s.len()); }
```

## Раздел 13. Сериализация и файловый ввод‑вывод
- `serde`/`serde_json` для JSON, `std::fs` для файлов.

## Раздел 14. Макросы
- `derive` (автогенерация), `macro_rules!` для шаблонов.
```rust
#[derive(Debug, Clone, PartialEq)] struct User{ name:String }
```

## Раздел 15. Тестирование
- Юнит‑тесты `#[test]`, интеграционные тесты в `tests/`, док‑тесты в `///`.
```rust
#[test] fn add(){ assert_eq!(2+3, 5); }
```

## Раздел 16. Производительность и профилирование
- `cargo build --release`, `perf`, `criterion` для бенчей, `cargo flamegraph`.

## Раздел 17. Частые подводные камни
- Избыточные `clone()`: думайте о владении и заимствовании.
- `String` vs `&str`: не копируйте строки без надобности.
- Замыкания захватывают переменные по ссылке по умолчанию.

## Раздел 18. Экосистема
- Веб: Axum/Actix‑web, сериализация: Serde, асинхронка: Tokio, БД: SQLx/Diesel.

## Раздел 19. Ресурсы
- The Rust Book, Rust By Example, Rustlings, Effective Rust, Clippy lints.
