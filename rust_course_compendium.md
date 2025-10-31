# Компендим по Rust

Подробное руководство по языку Rust: установка, владение/заимствование, работа с коллекциями, асинхронность, тестирование и подготовка к production. Все разделы снабжены примерами и пояснениями для новичков.

---

## 1. Установка и обновление
- Установите `rustup` — менеджер инструментов Rust:
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
- Добавьте `~/.cargo/bin` в `PATH`.
- Проверка: `rustc --version`, `cargo --version`.
- Обновление: `rustup update`.
- Выбор канала: `rustup default stable` (стабильный), `beta`, `nightly`.

### Дополнительные инструменты
- `rustup component add rustfmt clippy` — форматирование и линтер.
- `cargo install cargo-edit` — команды `cargo add`, `cargo rm`, `cargo upgrade`.
- IDE: VS Code (`rust-analyzer`, `CodeLLDB`), JetBrains RustRover, CLion.

---

## 2. Первый проект и структура
```bash
cargo new hello-rust --bin
cd hello-rust
cargo run
```
- `Cargo.toml` — манифест проекта (зависимости, версия, edition).
- `src/main.rs` — точка входа (для бинарника).
- `src/lib.rs` — библиотека (для общих функций).
- `cargo check` — проверка без сборки.
- `cargo build` (`--release` для оптимизации).
- `cargo run` — сборка + запуск.

---

## 3. Синтаксис и базовые типы
- Числа: `i8`, `i16`, `i32`, `i64`, `i128`, `isize` и соответствующие беззнаковые `u*`.
- Литералы: `42`, `42i32`, `0xFF`, `0b1010`, `1_000`.
- Булевы типы (`bool`), символы (`char`), кортежи (`(i32, bool)`).
- Массивы `[T; N]`, срезы `&[T]`.
- Строки: `&str` (заимствованная), `String` (владеющая).

```rust
let mut nums: Vec<i32> = Vec::new();
nums.push(10);
```

---

## 4. Управляющие конструкции
- `if/else`, `match`, `loop`, `while`, `for`.
- `match` должен охватывать все варианты.
- `if let` и `while let` для сопоставления с образцом.

```rust
let rating = match score {
    90..=100 => "A",
    80..=89 => "B",
    _ => "C",
};
```

---

## 5. Владение и заимствование
- **Владение (Ownership)**: каждый ресурс (например, `String`) имеет владельца. При присваивании или передаче владение перемещается (move).
- **Заимствование (Borrowing)**: `&T` (иммутабельное), `&mut T` (мутабельное). Не более одного `&mut` одновременно, либо любое количество `&T`.
- **Срок жизни (Lifetime)**: компилятор гарантирует, что ссылка живёт дольше, чем её использование.

```rust
fn len(s: &String) -> usize {
    s.len()
}

fn main() {
    let mut name = String::from("Rust");
    let length = len(&name); // заимствование, владение остаётся у name
    name.push_str("acean");
    println!("{length}, {name}");
}
```

---

## 6. Структуры, кортежи и перечисления
- `struct` — пользовательские типы:
  ```rust
  struct User {
      id: i32,
      email: String,
      active: bool,
  }
  ```
- Методы и ассоциированные функции:
  ```rust
  impl User {
      fn activate(&mut self) {
          self.active = true;
      }

      fn new(email: String) -> Self {
          Self { id: 0, email, active: false }
      }
  }
  ```
- `enum` — перечисления с возможностью хранения данных (алгебраические типы).

```rust
enum State {
    Loading,
    Success(Vec<String>),
    Error(String),
}

fn render(state: State) {
    match state {
        State::Loading => println!("loading..."),
        State::Success(items) => println!("items: {items:?}"),
        State::Error(err) => eprintln!("error: {err}"),
    }
}
```

---

## 7. Pattern matching и деструктуризация
- `match`, `let`-деструктуризация, `if let`.
- Шаблоны: `_`, `..`, константы, диапазоны, guard (`if condition`).
- Пример:
  ```rust
  if let Some((name, age)) = user {
      println!("{name} is {age}");
  }
  ```

---

## 8. Обработка ошибок
- `Result<T, E>` и `Option<T>`.
- Оператор `?` — пробрасывает ошибку.
- Своё перечисление ошибок + `thiserror` или `anyhow`:
  ```rust
  use anyhow::{Context, Result};

  fn read_config() -> Result<String> {
      let data = std::fs::read_to_string("config.toml")
          .context("failed to read config")?;
      Ok(data)
  }
  ```
- Паника (`panic!`) — аварийное завершение. Используйте в случаях, когда продолжение работы невозможно.

---

## 9. Generics и трейты
- Generics: `fn max<T: Ord>(items: &[T]) -> Option<&T>`.
- Трейты описывают поведение:
  ```rust
  trait Printable {
      fn print(&self);
  }

  impl Printable for User {
      fn print(&self) {
          println!("{} ({})", self.email, self.id);
      }
  }
  ```
- `impl Trait` — упрощение сигнатур.
- Лайфтаймы указываются, если функция возвращает ссылку на входной параметр.
- Blanket-реализация: `impl<T: Display> Printable for T`.

---

## 10. Коллекции и итераторы
- `Vec<T>`, `VecDeque<T>`, `HashMap<K, V>`, `HashSet<T>`, `BTreeMap`, `BinaryHeap`.
- Итераторы: `iter`, `into_iter`, `iter_mut`.
- Адаптеры: `map`, `filter`, `fold`, `collect`, `enumerate`, `zip`.
- `collect::<Vec<T>>()`, `collect::<HashMap<K, V>>()`.

---

## 11. Модули и видимость
- Модули определяют структуру проекта: `mod`, `pub mod`, `pub(crate)`.
- Файы: `mod.rs` (до Rust 2018), теперь можно `mod service;` и `src/service.rs`.
- `use crate::module::Thing;`
- Пакеты Cargo (workspace) позволяют объединять несколько crate:
  ```toml
  [workspace]
  members = ["service", "api", "cli"]
  ```

---

## 12. Async/await
- Асинхронный код требует runtime (Tokio, async-std).
- Пример на Tokio:
  ```rust
  #[tokio::main]
  async fn main() -> Result<()> {
      let resp = reqwest::get("https://example.com")
          .await?
          .text()
          .await?;
      println!("{}", resp.len());
      Ok(())
  }
  ```
- Фьючерсы (`Future`) исполняются только при ожидании (`.await`).
- Потоки (streams): `futures::stream::Stream`, `tokio_stream`.
- Конкурентность: `join!`, `select!`, `tokio::spawn`.

---

## 13. Взаимодействие с файлами и сетью
- `std::fs::{read_to_string, File}`, `std::io::{BufReader, BufWriter}`.
- Серилизация: `serde` (`#[derive(Serialize, Deserialize)]`), JSON (`serde_json`), YAML (`serde_yaml`).
- HTTP: `reqwest`, `hyper`, `actix-web`, `axum`.
- gRPC: `tonic`.
- Базы данных: `sqlx`, `diesel`, `sea-orm`.

---

## 14. Тестирование
- Юнит-тесты: `#[cfg(test)] mod tests`.
  ```rust
  #[cfg(test)]
  mod tests {
      use super::*;

      #[test]
      fn adds_two() {
          assert_eq!(add(2, 3), 5);
      }
  }
  ```
- Интеграционные тесты: каталог `tests/`, каждая `.rs` — отдельный бинарник.
- Док-тесты: пишите примеры в комментариях `///`.
- `cargo test -- --nocapture` — вывод в stdout.
- Mocking: `mockall`, `double`.
- Property-based testing: `proptest`, `quickcheck`.

---

## 15. Оптимизация и профилирование
- Компиляция с оптимизациями: `cargo build --release`.
- Профилирование CPU/Memory: `perf`, `valgrind`, `heaptrack`.
- `cargo flamegraph` (нужен `perf` и `flamegraph`).
- Benchmark: `cargo bench` (через `criterion` для стабильных результатов).
- Inspector: `cargo bloat` для анализа размера бинарника.

---

## 16. Безопасность и FFI
- Unsafe-блоки (`unsafe { ... }`) для работы с указателями — используйте минимально.
- FFI c C: `extern "C"` функции, `bindgen`.
- Работа с библиотеками C/C++ (OpenSSL, zlib) через `*-sys` crates.

---

## 17. DevOps и деплой
- Статически слинкованные бинарники (в Linux: `musl`):
  ```bash
  rustup target add x86_64-unknown-linux-musl
  cargo build --release --target x86_64-unknown-linux-musl
  ```
- Dockerfile:
  ```dockerfile
  FROM rust:1.79 AS build
  WORKDIR /usr/src/app
  COPY Cargo.toml Cargo.lock ./
  COPY src ./src
  RUN cargo build --release

  FROM gcr.io/distroless/cc
  COPY --from=build /usr/src/app/target/release/app /app
  CMD ["/app"]
  ```
- CI: GitHub Actions (`actions-rs/toolchain`, `cargo fmt`, `cargo clippy`, `cargo test`).

---

## 18. Типичные ошибки
1. **Непонимание владения** → долгое исправление borrow checker. Старайтесь использовать ссылки и срезы.
2. **Чрезмерное клонирование** (`clone()`) → потеря преимуществ владения. Клонируйте только при необходимости.
3. **Использование `unwrap()` в продакшне** — лучше `?` или обработка ошибки.
4. **Глобальная мутация** — избегайте `static mut`, используйте `OnceCell`, `lazy_static`.
5. **Deadlock в async** — смешивание sync и async (блокирующий код внутри async). Используйте `spawn_blocking`.
6. **Большие компиляции** — оптимизируйте зависимости, используйте `cargo build --release` только когда нужно, включайте `incremental = true`.

---

## 19. Дорожная карта изучения
1. Пройдите книгу [The Rust Programming Language](https://doc.rust-lang.org/book/).
2. Напишите CLI утилиту (`clap`, `structopt`).
3. Создайте веб-сервис (Axum/Actix) с подключением к БД (sqlx).
4. Реализуйте асинхронную обработку (Tokio, RabbitMQ, Kafka).
5. Настройте тесты, линтеры (`cargo fmt`, `cargo clippy`), CI/CD.
6. Изучите `unsafe`, `FFI`, `Pin`, `Send/Sync`, если планируете системный уровень.
7. Освойте профилирование и оптимизацию.

---

## 20. Ресурсы
- Документация: [doc.rust-lang.org](https://doc.rust-lang.org/), [Rust By Example](https://doc.rust-lang.org/rust-by-example/).
- Практика: Rustlings, Exercism, Advent of Code.
- Книги: *Programming Rust* (Blandy, Orendorff), *Rust for Rustaceans* (David Mell).
- Сообщества: Rust Users Forum, Reddit r/rust, Discord Rust, локальные митапы Rust.
- Блоги и подкасты: Rust Blog, Ferry Blog, Rustacean Station.

> Rust требует времени на понимание владения, но взамен даёт безопасность и производительность на уровне C/C++. Практикуйтесь, читайте error messages, используйте Clippy — и borrow checker станет вашим союзником.
