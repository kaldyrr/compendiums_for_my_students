# Курс‑компендиум по Go (Golang)

Практичный, понятный и насыщенный гид: от нуля до уверенной разработки.

## Раздел 1. Для кого и предпосылки
- Вы пишете серверы, CLIs, утилиты или сетевые сервисы.
- Базовый опыт командной строки и Git поможет.

## Раздел 2. Установка и проверка окружения
- Установите Go c golang.org. Проверка: `go version`, `go env GOPATH`.
- Обновите инструменты: `go install golang.org/x/tools/gopls@latest`.

## Раздел 3. Быстрый старт (модуль + hello)
- `mkdir app && cd app && go mod init example.com/app`.
- Создайте `main.go` и запустите `go run .`, сборка `go build`.
```go
package main
import "fmt"
func main(){ fmt.Println("Hello, Go") }
```

## Раздел 4. Структура проекта
- `cmd/<name>/main.go` для бинарей, `internal/` для приватного кода, `pkg/` для общеиспользуемого.
- `go.mod` — имя модуля и зависимости, `go.sum` — контрольные суммы.

## Раздел 5. Типы, литералы, нулевые значения
- Базовые: `int`, `float64`, `bool`, `string`, `rune`, `byte`.
- Нулевые значения: `0`, `false`, `""`, `nil` для ссылочных типов.
- Короткое объявление: `x := 10`.
```go
var a int; fmt.Println(a) // 0
name := "Ann"; ch := make(chan int)
_ = ch; _ = name
```

## Раздел 6. Управляющие конструкции
- `if`, единственный цикл `for` (все варианты), `switch`, `defer`.
```go
for i:=0; i<3; i++ { fmt.Println(i) }
switch day := 2; day { case 1,2: fmt.Println("wk"); default: }
```

## Раздел 7. Функции, множественный возврат и ошибки
- Go возвращает `(T, error)`. Ошибка — обычное значение.
- Заворачивание: `fmt.Errorf("context: %w", err)`, проверка: `errors.Is/As`.
```go
func div(a,b float64) (float64, error){
  if b==0 { return 0, fmt.Errorf("divide by zero") }
  return a/b, nil
}
```

## Раздел 8. Коллекции: массивы, срезы, map
- Срезы `[]T`: `len`, `cap`, `append`, `copy`; make: `make([]T, len, cap)`.
- `map[K]V`: инициализируйте перед использованием: `m := map[string]int{}`.
```go
xs := make([]int, 0, 4); xs = append(xs, 1,2,3)
m := map[string]int{"a":1}; v, ok := m["a"]; _ = v; _ = ok
```

## Раздел 9. Строки и руны
- Строки — байты в UTF‑8; для символов используйте `rune` и `range`.
```go
s := "Привет"; for _, r := range s { fmt.Printf("%c ", r) }
```

## Раздел 10. Методы, структуры, конструкторы
- Методы на типах, значение/указатель‑получатель.
```go
type User struct{ Name string; Age int }
func (u User) Hello() string { return "Hi, "+u.Name }
func NewUser(name string) *User { return &User{Name:name} }
```

## Раздел 11. Интерфейсы и утиная типизация
- Не требуют явного `implements`. Проектируйте маленькие интерфейсы.
```go
type Greeter interface{ Hello() string }
func greet(g Greeter){ fmt.Println(g.Hello()) }
```

## Раздел 12. Дженерики (1.18+)
- Параметры типов и ограничения через интерфейсы.
```go
func First[T any](xs []T) (T, bool){ var z T; if len(xs)==0 { return z,false }; return xs[0], true }
```

## Раздел 13. Конкурентность: горутины и каналы
- Запуск: `go f()`. Коммуникация: `chan`, неблокирующий `select`.
```go
ch := make(chan int)
go func(){ ch <- 42 }()
select { case v := <-ch: fmt.Println(v); case <-time.After(time.Second): fmt.Println("timeout") }
```

## Раздел 14. Синхронизация и пулы
- `sync.WaitGroup`, `sync.Mutex`, пакет `sync/atomic`.
```go
var wg sync.WaitGroup; wg.Add(1); go func(){ defer wg.Done() }(); wg.Wait()
```

## Раздел 15. Context: отмена и таймауты
- Пробрасывайте `ctx context.Context` в I/O и сетевые вызовы.
```go
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second); defer cancel()
req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
```

## Раздел 16. Ввод‑вывод и интерфейсы io.Reader/io.Writer
- Используйте потоковые интерфейсы, буферизацию через `bufio`.
```go
r := strings.NewReader("data"); b, _ := io.ReadAll(r); _ = b
```

## Раздел 17. Файлы, JSON и теги
- `os.ReadFile/WriteFile`, `encoding/json`, теги `json:"name,omitempty"`.
```go
type Item struct{ A int `json:"a"`; B string `json:"b,omitempty"` }
buf, _ := json.Marshal(Item{A:1}); _ = os.WriteFile("out.json", buf, 0644)
```

## Раздел 18. HTTP клиент/сервер
- Клиент с таймаутом; минимальный сервер.
```go
cli := &http.Client{ Timeout: 5 * time.Second }
resp, _ := cli.Get("https://example.com"); _ = resp.Body.Close()
http.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request){ w.Header().Set("Content-Type","application/json"); w.Write([]byte(`{"ok":true}`)) })
_ = http.ListenAndServe(":8080", nil)
```

## Раздел 19. Тесты, под‑тесты, бенчмарки
- `go test ./...`, под‑тесты `t.Run`, бенчмарки `BenchmarkX`.
```go
func TestAdd(t *testing.T){ t.Run("basic", func(t *testing.T){ if 2+3!=5 { t.Fatal() } }) }
func BenchmarkAdd(b *testing.B){ for i:=0;i<b.N;i++ { _ = 2+3 } }
```

## Раздел 20. Инструменты качества
- Форматирование: `gofmt -s -w .`/`go fmt`.
- Анализ: `go vet`, `staticcheck`, `golangci-lint`.
- Модули: `go mod tidy`, `go list -m -u all`.

## Раздел 21. Профили и раскомпоновка проблем
- Детектор гонок: `go test -race`.
- Профили `pprof`: `import _ "net/http/pprof"` и `go tool pprof`.

## Раздел 22. Частые подводные камни
- `nil`‑map: нужно инициализировать перед записью.
- Замыкания в цикле — захват одной переменной:
```go
for i:=0;i<3;i++{ i := i; go func(){ fmt.Println(i) }() } // теним i
```
- Срезы делят буфер: изменение подпоследовательности может влиять на исходный.
- Используйте `context`, не делайте блокирующих операций без таймаутов.

## Раздел 23. Экосистема (выдержка)
- Веб: `gin`, `echo`, `fiber`; gRPC: `grpc-go`.
- БД: `sqlx`, `gorm`, миграции `golang-migrate`.
- CLIs: `cobra`, конфиг `viper`.

## Раздел 24. Стиль кода и ссылки
- Официальный «Effective Go», `go.dev/doc/effective_go`.
- «Go Proverbs» и «Concurrency is not parallelism» (Rob Pike).
- Учебник: `tour.golang.org`, книги Donovan & Kernighan.
