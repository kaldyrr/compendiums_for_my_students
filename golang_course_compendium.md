# Компендим по языку Go (Golang)

Подробное руководство для начинающего разработчика. Охватывает установку, базовый синтаксис, работу с модулями, тестирование, конкурентность и типичные сценарии production‑разработки.

---

## 1. Зачем изучать Go
- Компилируемый язык, создавался для серверных приложений, CLI‑утилит, микросервисов, распределённых систем.
- Простой синтаксис, встроенная поддержка конкурентности (goroutines, channels), статическая типизация и garbage collector.
- Поставляется с богатой стандартной библиотекой (HTTP, JSON, crypto, io, sync).

---

## 2. Установка и настройка
### 2.1 Установка Go
- **Windows/macOS**: скачайте инсталлятор с [go.dev/dl](https://go.dev/dl/), следуйте инструкциям.
- **Linux**:
  ```bash
  wget https://go.dev/dl/go1.23.0.linux-amd64.tar.gz
  sudo rm -rf /usr/local/go
  sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz
  echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.bashrc
  ```
  Проверьте: `go version`.

### 2.2 GOPATH и рабочее окружение
- `go env GOPATH` — путь до рабочего каталога модулей (по умолчанию `%USERPROFILE%\go` или `$HOME/go`).
- Добавьте `$GOPATH/bin` в `PATH`, чтобы использовать установленные утилиты (`golangci-lint`, `air`, `dlv`).

### 2.3 Редакторы и инструменты
- **GoLand** (JetBrains) — полноценная IDE.
- **VS Code** с расширением `golang.go` (устанавливает `gopls`, `dlv`, `goimports`, автолинтинг).
- Форматирование: `gofmt` (встроено), `goimports`.
- Линтинг: `golangci-lint`.

---

## 3. Первый проект и модули
```bash
mkdir hello-go && cd hello-go
go mod init example.com/hello
cat <<'EOF' > main.go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
EOF
go run .
```
- `go mod init` — создаёт `go.mod` (имя модуля, зависимости).
- `go run .` — компиляция + запуск.
- `go build` — создаёт бинарник в текущей директории.
- `go install` — компиляция и установка бинарника в `$GOPATH/bin`.

---

## 4. Структура проектов
- `cmd/<app>/main.go` — входная точка (поддержка нескольких CLI).
- `internal/` — пакеты, недоступные извне (инкапсуляция).
- `pkg/` — общие пакеты (если нужно экспортировать сторонним модулем).
- `configs/`, `deploy/`, `scripts/`, `docs/` — дополнительные каталоги.
- Тесты рядом с кодом: `module/file.go` и `module/file_test.go`.

---

## 5. Синтаксис и базовые типы
- Простые типы: `bool`, `string`, целые (`int`, `uint8`, `rune`), вещественные (`float32`, `float64`), комплексные (`complex64`), `byte`.
- Нулевые значения (`zero values`): `0`, `false`, `""`, `nil`.
- Объявления:
  ```go
  var age int = 30
  var name = "Ann"   // тип выводится
  score := 95        // короткое объявление (внутри функции)
  ```
- Константы: `const limit = 100`.

---

## 6. Коллекции
### 6.1 Массивы
- Фиксированный размер: `var digits [3]int`.
- Копируются при передаче в функцию.

### 6.2 Срезы (slices)
- Динамические массивы: `[]int{1, 2, 3}`, `make([]int, 0, 5)`.
- Методы: `len`, `cap`, `append`, `copy`.
- Срезы указывают на один и тот же массив — операции влияют на общий бэкенд.

```go
numbers := []int{1, 2, 3}
numbers = append(numbers, 4)
```

### 6.3 Карты (map)
- Ассоциативные массивы: `map[string]int{"a": 1}`.
- Проверка наличия: `value, ok := map[key]`.
- Для удаления: `delete(map, key)`.

### 6.4 Строки и руны
- Строки неизменяемы, UTF‑8. Для работы с символами (`unicode`, `strings`).
- `rune` — Unicode code point (int32).

---

## 7. Управляющие конструкции
- `if/else`, `switch` (может работать без выражения — эквивалент `switch true`), `for` (единственный цикл).
- `goto`, `break`, `continue` с метками.
- `defer` — отложенное выполнение (используется для освобождения ресурсов).

```go
for i := 0; i < 3; i++ {
    fmt.Println(i)
}

switch day := time.Now().Weekday(); day {
case time.Saturday, time.Sunday:
    fmt.Println("выходной")
default:
    fmt.Println("рабочий день")
}
```

---

## 8. Функции, методы и обработка ошибок
- Возврат нескольких значений:
  ```go
  func div(x, y float64) (float64, error) {
      if y == 0 {
          return 0, fmt.Errorf("divide by zero")
      }
      return x / y, nil
  }
  ```
- Именованные результаты (используйте аккуратно, чтобы не запутать чтение).
- Ошибки — часть результата (`error`). Используйте `errors.Is`, `errors.As`, `fmt.Errorf("context: %w", err)`.

### Методы
- Методы можно объявлять на любом типе, объявленном в текущем пакете.
  ```go
  type User struct {
      Name string
  }

  func (u User) Greet() string {
      return "Привет, " + u.Name
  }
  ```
- Различайте value receiver (`u User`) и pointer receiver (`u *User`). Pointer позволяет изменять состояние.

---

## 9. Структуры и инкапсуляция
- Структуры определяют новые типы данных:
  ```go
  type Invoice struct {
      ID     string
      Amount float64
  }
  ```
- Поля с заглавной буквы экспортируются (публичные), со строчной — внутри пакета.
- Встраивание (embedding) даёт возможность «наследования» поведения:
  ```go
  type WithAudit struct {
      CreatedAt time.Time
  }

  type Order struct {
      WithAudit
      Amount float64
  }
  ```

---

## 10. Интерфейсы
- Интерфейс — набор методов. Реализация происходит автоматически, без ключевого слова `implements`.
  ```go
  type Greeter interface {
      Hello() string
  }

  func Welcome(g Greeter) {
      fmt.Println(g.Hello())
  }
  ```
- Нулевое значение интерфейса — `nil`. Проверяйте `if value == nil`.
- Используйте маленькие интерфейсы (принцип интерфейсов по потребности — *interface segregation*). Пример: `io.Reader`, `io.Writer`.
- При проверке типов используйте type assertion (`v, ok := val.(MyType)`) или type switch.

---

## 11. Generics (Go 1.18+)
- Шаблонные функции/типы для переиспользования.
```go
func Filter[T any](items []T, predicate func(T) bool) []T {
    result := make([]T, 0, len(items))
    for _, item := range items {
        if predicate(item) {
            result = append(result, item)
        }
    }
    return result
}
```
- Ограничения (`constraints`): `constraints.Ordered` (поддержка `<`, `>`, `==`). Можно описывать собственные (`type Number interface { ~int | ~float64 }`).
- Используйте generics там, где иначе пришлось бы дублировать код.

---

## 12. Пакеты и модули
- Каждый файл начинается с `package name`. Главная функция `main` находится только в пакете `main`.
- Импорт пакетов: `import ("fmt"; "net/http")`. Неиспользуемый импорт вызывает ошибку компиляции.
- Версионирование: `go get example.com/lib@v1.2.3`. В go.mod появится `require example.com/lib v1.2.3`.
- `replace` — замена зависимости локальной версией (`replace example.com/lib => ../lib`).
- `exclude` — исключение конкретной версии.

---

## 13. Ввод-вывод и сериализация
- Работа с файлами: `os.ReadFile`, `os.WriteFile`, `os.Open`, `bufio`.
- JSON: `encoding/json`, теги (`json:"name,omitempty"`), `Decoder`/`Encoder` для потоковой обработки.
- YAML, TOML: сторонние библиотеки (`gopkg.in/yaml.v3`, `github.com/pelletier/go-toml/v2`).

---

## 14. Сети и веб‑сервисы
- HTTP server:
  ```go
  func main() {
      mux := http.NewServeMux()
      mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
          w.Header().Set("Content-Type", "application/json")
          w.WriteHeader(http.StatusOK)
          w.Write([]byte(`{"ok": true}`))
      })

      srv := &http.Server{
          Addr:         ":8080",
          Handler:      mux,
          ReadTimeout:  5 * time.Second,
          WriteTimeout: 10 * time.Second,
      }
      log.Fatal(srv.ListenAndServe())
  }
  ```
- Клиент: `http.Client` (настраивайте таймауты, транспорт).
- Роутеры: `chi`, `gorilla/mux`, `gin`, `echo`.
- gRPC: `google.golang.org/grpc`, `protoc --go_out`.

---

## 15. Конкурентность
### 15.1 Goroutines
- Лёгкие потоки, запускаются через `go func() { ... }()`.
- Планируются рантаймом, сотни тысяч goroutine в одном процессе.

### 15.2 Каналы
```go
ch := make(chan int)
go func() {
    ch <- 42
}()
value := <-ch
```
- Буферизированные: `make(chan int, 10)`.
- Закрытие: `close(ch)`, чтение `value, ok := <-ch`.
- `select` для неблокирующих операций:
  ```go
  select {
  case msg := <-messages:
      fmt.Println(msg)
  case <-time.After(time.Second):
      fmt.Println("timeout")
  }
  ```

### 15.3 Синхронизация
- `sync.WaitGroup` — ожидание группы goroutines.
- `sync.Mutex`, `sync.RWMutex` — блокировки.
- `sync.Once`, `sync.Map`, `sync.Pool`.
- `atomic` операции (`atomic.AddInt64`, `atomic.Value`) для безлоковых структур.

### 15.4 Context
- Управление отменой, дедлайнами:
  ```go
  ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
  defer cancel()
  select {
  case <-ctx.Done():
      return ctx.Err()
  }
  ```
- Передавайте `ctx` первым параметром во все функции, выполняющие I/O или длительные операции.

---

## 16. Тестирование
- Unit-тесты:
  ```go
  func TestAdd(t *testing.T) {
      if Add(2, 3) != 5 {
          t.Fatalf("expected 5")
      }
  }
  ```
- `go test ./...` — запустить все.
- Табличные тесты:
  ```go
  func TestDivide(t *testing.T) {
      cases := []struct {
          name string
          a, b float64
          want float64
          wantErr bool
      }{
          {"ok", 10, 2, 5, false},
          {"zero", 10, 0, 0, true},
      }
      for _, tc := range cases {
          t.Run(tc.name, func(t *testing.T) {
              got, err := Divide(tc.a, tc.b)
              if tc.wantErr && err == nil {
                  t.Fatal("expected error")
              }
              if !tc.wantErr && got != tc.want {
                  t.Fatalf("expected %v got %v", tc.want, got)
              }
          })
      }
  }
  ```
- Моки: `go test` поддерживает интерфейсы. Используйте `gomock`, `testify/mock`, `moq`.
- Benchmark: `func BenchmarkX(b *testing.B)`.
- Coverage: `go test -cover -coverprofile=cover.out`.
- Интеграционные тесты: запуск docker-контейнеров (`ory/dockertest`, `testcontainers-go`).

---

## 17. Инструменты разработки
- Форматирование: `gofmt`, `goimports`.
- Линтеры: `golangci-lint run`, включает `govet`, `staticcheck`, `errcheck`, `gosimple`.
- Профилирование: `go test -bench . -benchmem`, `go tool pprof`, `pprof`-сервер (`import _ "net/http/pprof"`).
- Отладка: `dlv debug` (Delve), интеграция с IDE.
- Live reload для веб-приложений: `air`, `fresh`.

---

## 18. Сборка и деплой
- Кросс-компиляция: `GOOS=linux GOARCH=amd64 go build -o app-linux ./cmd/api`.
- Сборка статических бинарников: `CGO_ENABLED=0 go build`.
- Версионирование внутри бинарника: флаги линкера (`-ldflags "-X main.version=$(git describe --tags)"`).
- Dockerfile:
  ```dockerfile
  FROM golang:1.23 AS build
  WORKDIR /src
  COPY go.mod go.sum ./
  RUN go mod download
  COPY . .
  RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app ./cmd/api

  FROM gcr.io/distroless/base-debian12
  COPY --from=build /app /app
  ENTRYPOINT ["/app"]
  ```
- В CI используйте `go test`, `golangci-lint`, `go build`, `docker build`.

---

## 19. Работа с БД и конфигурациями
- SQL: стандартные драйверы через `database/sql`, дополнительные библиотеки: `jmoiron/sqlx`, `gorm`, `ent`.
- Миграции: `golang-migrate`, `goose`.
- NoSQL: MongoDB (`mongo-go-driver`), Redis (`go-redis`).
- Конфигурация: `os.Getenv`, `spf13/viper`, `envconfig`.

---

## 20. Типичные ошибки
1. **Не обрабатывать ошибки** — всегда проверяйте `if err != nil`.
2. **Глобальные переменные** — затрудняет тестирование. Используйте dependency injection через интерфейсы.
3. **Забытый `defer resp.Body.Close()`** — приводит к утечкам дескрипторов.
4. **Обращение к `nil` map/slice** — инициализируйте через `make`.
5. **Горутины без завершения** — передавайте context и закрывайте каналы.
6. **Использование `time.Sleep` вместо ожидания событий** — приводите конкурентность к синхронизированным механизмам.
7. **Паника без восстановления** — используйте `panic` только для действительно критических ситуаций; в HTTP‑handler добавьте `recover`.

---

## 21. Дорожная карта изучения
1. Пройдите [Go Tour](https://go.dev/tour/).
2. Напишите утилиту (CLI) и REST API.
3. Изучите тестирование, добейтесь покрытия ключевой логики.
4. Реализуйте конкуррентный компонент с использованием goroutines и каналов.
5. Настройте CI: `go test`, `golangci-lint`, сборка Docker.
6. Освойте работу с БД, миграциями, конфигурацией.
7. Изучите профилирование, оптимизацию, работу с GC.

---

## 22. Ресурсы
- Документация: [go.dev/doc](https://go.dev/doc/), [pkg.go.dev](https://pkg.go.dev/).
- Книги: *The Go Programming Language* (Donovan & Kernighan), *Go in Action*, *Concurrency in Go*.
- Практика: Exercism, LeetCode (раздел Go), Advent of Code.
- Блоги и подкасты: Go Blog, Gopher Academy, GoTime.fm.
- Сообщества: Gopher Slack, Reddit r/golang, локальные митапы.

> Начните с небольших проектов, постепенно подключайте взаимодействие с БД, параллелизм и деплой. Опыт приходит через практику и чтение исходников стандартной библиотеки.
