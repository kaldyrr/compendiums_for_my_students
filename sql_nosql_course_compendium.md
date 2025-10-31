# Компендим по SQL и NoSQL

Подробное руководство по работе с реляционными и нереляционными базами данных. Подходит для студентов и начинающих аналитиков/разработчиков, которые хотят понимать теорию и практику хранения данных, оптимизации и эксплуатации.

---

## 1. Введение
- **Реляционные системы (SQL)**: данные в таблицах, фиксированная схема, язык SQL. Примеры: PostgreSQL, MySQL, SQL Server, Oracle.
- **NoSQL**: гибкая схема, горизонтальная масштабируемость, часто ориентированы на конкретные сценарии.
  - Key-Value (Redis, DynamoDB)
  - Документные (MongoDB, Couchbase)
  - Колонночные (Cassandra, HBase)
  - Графовые (Neo4j, JanusGraph)
- Выбор зависит от задач: транзакционность, консистентность, масштабирование, схема, анализ данных.

---

## 2. Проектирование данных
- **Требования**: кто использует данные, каковы объёмы, частота чтения/записи.
- **ER-модель**: сущности, связи (1:1, 1:N, M:N), атрибуты.
- **Нормализация (1NF, 2NF, 3NF)**: избавляет от избыточности и аномалий. Для аналитики допускают денормализацию.
- **Ключи**:
  - Первичный (PK) — уникально идентифицирует строку.
  - Внешний (FK) — обеспечивает ссылочную целостность.
  - Суррогатные (например, `SERIAL`, `UUID`) против естественных (email, номер договора).
- **Схемы в NoSQL**:
  - Документные: модель под потребление (document-per-entity, nested arrays).
  - Key-Value: плоская структура (`user:123 -> JSON`).
  - Колонночные: широкие таблицы (row key + column families).
  - Графовые: вершины и рёбра (node/relationship).

---

## 3. Базовый SQL
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

INSERT INTO users (email, name) VALUES ('ann@example.com', 'Ann');

SELECT id, email FROM users WHERE email LIKE '%@example.com' ORDER BY id;

UPDATE users SET name = 'Anna' WHERE id = 1;
DELETE FROM users WHERE id = 1;
```
- Используйте параметризацию (`$1`, `?`) для защиты от SQL‑инъекций.
- `RETURNING` (PostgreSQL) возвращает данные из вставки/обновления.

---

## 4. JOIN и агрегаты
- `INNER JOIN` — пересечение.
- `LEFT JOIN` — строки из левой таблицы + совпадения справа.
- `RIGHT JOIN`, `FULL OUTER JOIN`.
- `CROSS JOIN` — декартово произведение.
- Агрегации: `COUNT`, `SUM`, `AVG`, `MAX`, `MIN`, `GROUP BY`, `HAVING`.

```sql
SELECT u.name, COUNT(o.id) AS orders_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.name
HAVING COUNT(o.id) > 0;
```

---

## 5. Подзапросы и CTE
- Подзапросы в `SELECT`, `FROM`, `WHERE`.
- Common Table Expressions (CTE):
```sql
WITH recent_orders AS (
  SELECT * FROM orders WHERE created_at > now() - interval '7 days'
)
SELECT u.name, COUNT(ro.id)
FROM users u
LEFT JOIN recent_orders ro ON ro.user_id = u.id
GROUP BY u.name;
```
- Рекурсивные CTE (`WITH RECURSIVE`) — обход деревьев, иерархий.

---

## 6. Оконные функции (Window Functions)
- `OVER(PARTITION BY ... ORDER BY ...)`.

```sql
SELECT
  user_id,
  amount,
  SUM(amount) OVER (PARTITION BY user_id ORDER BY created_at) AS running_total,
  RANK() OVER (PARTITION BY user_id ORDER BY amount DESC) AS rank_within_user
FROM payments;
```
- Лаг/лид (`LAG`, `LEAD`), `ROW_NUMBER`, `NTILE`.

---

## 7. Индексы и оптимизация
- Типы индексов (PostgreSQL):
  - B-Tree (по умолчанию) — для равенства/сравнения.
  - Hash (равенство).
  - GIN/GiST (полнотекстовый поиск, JSONB, геоданные).
  - BRIN (большие неравномерные таблицы).
- Создание:
  ```sql
  CREATE INDEX ON orders (user_id, created_at DESC);
  ```
- Проверка запросов: `EXPLAIN`, `EXPLAIN ANALYZE`.
- Статистика: `ANALYZE`, авто-обновление планов.
- Материализованные представления (`CREATE MATERIALIZED VIEW`) — кэширование тяжёлых запросов.

---

## 8. Транзакции и изоляция
- ACID: Atomicity, Consistency, Isolation, Durability.
- Транзакции:
  ```sql
  BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
  COMMIT;
  ```
- Уровни изоляции:
  - `READ UNCOMMITTED`
  - `READ COMMITTED` (по умолчанию PostgreSQL)
  - `REPEATABLE READ`
  - `SERIALIZABLE`
- Проблемы: dirty reads, non-repeatable reads, phantom reads, write skew.
- Механизмы блокировок, MVCC (PostgreSQL, Oracle).

---

## 9. Управление схемой
- Миграции: Flyway, Liquibase, Prisma Migrate, Alembic, dbmate.
- Версионирование схемы и миграций (`V1__init.sql`, `V2__add_orders.sql`).
- Контроль качества: review миграций, состояние среды, rollback план.

---

## 10. ORM и data access
- **ORM**: Hibernate (Java), Entity Framework (C#), SQLAlchemy (Python), TypeORM/Prisma (JS/TS).
- Плюсы: ускоряет разработку, декларативные модели.
- Минусы: скрывает сложные запросы, возможны N+1 проблемы.
- Рекомендации:
  - Инспектируйте SQL (логирование, профили).
  - Используйте `JOIN FETCH`/`Include` для загрузки связей.
  - Для сложных запросов пишите SQL вручную или используйте `View`.

---

## 11. NoSQL категории
### 11.1 Key-Value (Redis, DynamoDB)
- Простая схема: `key -> value`.
- Очень быстрые операции, TTL, Pub/Sub, Lua scripts.
- Используется для кешей, сессий, очередей.

### 11.2 Документные (MongoDB)
- JSON-подобные документы (`BSON`), динамическая схема.
- Коллекции, индексы (однополяные, составные, текстовые).
- Запросы: `find`, `aggregate`.
```javascript
db.orders.aggregate([
  { $match: { status: "PAID" } },
  { $group: { _id: "$userId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } }
])
```
- Шардинг и репликация.

### 11.3 Колонночные (Cassandra, HBase)
- Данные хранятся по колонкам. Идеально для событий и временных рядов.
- Ключевой дизайн: primary key = partition key + clustering columns.
- CQL (Cassandra Query Language) похож на SQL, но с ограничениями (нет `JOIN`, `WHERE` только по проиндексированным столбцам).

### 11.4 Графовые (Neo4j)
- Узлы (`(:User {name:'Ann'})`), ребра (`[:BOUGHT]`), pattern matching (Cypher).
```cypher
MATCH (u:User {name:'Ann'})-[:BOUGHT]->(item)
RETURN item.sku;
```
- Используются для рекомендательных систем, социальных графов, антифрода.

---

## 12. CAP и консистентность
- Нельзя одновременно обеспечить Consistency, Availability и Partition tolerance во всех ситуациях (CAP theorem).
- SQL-системы чаще CP/CA, NoSQL — AP/CP в зависимости от реализации.
- **Strong consistency**, **Eventual consistency**, **Causal consistency**.
- Репликация:
  - Master/Replica (Primary/Secondary).
  - Multi-master.
  - Leaderless (Dynamo, Cassandra) — используют `quorum` (`R + W > N`).

---

## 13. Кеширование
- Client-side caching (HTTP), application cache (in-memory, Redis).
- Cache-aside pattern: сначала читаем из кеша, при промахе — из БД + запись в кеш.
- Write-through, write-back.
- Инвалидация: TTL, версии, Pub/Sub обновления.

---

## 14. Безопасность
- Роли и привилегии (`GRANT`, `REVOKE`).
- Row-Level Security (PostgreSQL).
- Шифрование:
  - На уровне диска (TDE).
  - Внутри приложения (bcrypt, Argon2 для паролей).
- Аудит и логирование (pgAudit, MongoDB audit).
- SQL-инъекции — защищайтесь параметризацией и валидацией.

---

## 15. Резервное копирование и восстановление
- **Полный backup** (pg_dump, mysqldump).
- **Инкрементальные**: WAL (Write-Ahead Log), PITR (Point-in-Time Recovery).
- Стратегия восстановления (RPO/RTO):
  - RPO — сколько данных допустимо потерять.
  - RTO — время восстановления.
- Тестируйте восстановление регулярно.

---

## 16. Мониторинг и эксплуатация
- Метрики: `Connections`, `Slow queries`, `Cache hit ratio`, `Wal size`, `Lag`.
- Инструменты: `pg_stat_activity`, `pg_stat_statements`, `SHOW PROCESSLIST`, `db.currentOp()`.
- Мониторинг: Prometheus + exporters (`postgres_exporter`, `mongodb_exporter`), Grafana.
- Алерты: рост задержек, заполнение диска, replication lag.

---

## 17. Тестирование
- Юнит-тесты на запросы (например, с помощью Testcontainers).
- Интеграционные тесты: запуск реальной БД в Docker, миграции перед тестами.
- Генерация данных: `db::seed`, `fixtures`, `fakers`.
- Performance тесты: JMeter, k6, pgbench.

---

## 18. Типичные ошибки
1. **`SELECT *` в продакшне** — приводит к лишним данным, нарушает кэширование. Явно указывайте столбцы.
2. **Нет индекса по условию** — медленные запросы. Анализируйте `EXPLAIN`.
3. **Денормализация без понимания** — сложно поддерживать целостность.
4. **Секреты в коде** — храните строки подключения в переменных окружения или секрет-менеджере.
5. **Отсутствие ограничений (constraints)** — данные становятся неконсистентными. Используйте `NOT NULL`, `CHECK`, `FOREIGN KEY`.
6. **Неочищенные транзакции** — забытый `COMMIT/ROLLBACK` блокирует таблицы.
7. **Один размер для всех** — выбор БД без учёта специфики (например, MongoDB для транзакционных систем).

---

## 19. Дорожная карта
1. Изучите SQL синтаксис (SELECT, JOIN, агрегаты).
2. Освойте проектирование схемы и нормализацию.
3. Научитесь читать планы запросов (`EXPLAIN`).
4. Настройте миграции, CI для схемы.
5. Освойте одну NoSQL БД и её модель данных.
6. Внедрите мониторинг и бэкапы, автоматизируйте проверки.
7. Разберитесь с распределёнными системами (репликация, шардинг, CAP).

---

## 20. Ресурсы
- Книги: *Designing Data-Intensive Applications* (Kleppmann), *SQL Antipatterns* (Bill Karwin), *Seven Databases in Seven Weeks*.
- Документация: PostgreSQL, MongoDB, Redis, Cassandra, Neo4j (официальные сайты).
- Курсы: Udemy, Coursera (Databases), PostgreSQL for Everybody, MongoDB University.
- Практика: LeetCode Database, Hackerrank SQL, db-fiddle.com, SQLBolt, Mongo Playground.
- Инструменты: DBeaver, DataGrip, pgAdmin, Mongo Compass.

> Данные — сердце приложений. Понимание моделей хранения, индексации и транзакций помогает строить устойчивые и масштабируемые системы. Практикуйтесь на реальных задачах и регулярно анализируйте производительность запросов.
