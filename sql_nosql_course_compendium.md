# Курс‑компендиум по SQL/NoSQL

Модели данных, запросы, индексы, транзакции, масштабирование.

## Раздел 1. Модели и терминология
- Реляционная модель (таблицы/строки/столбцы); ключи: первичный/внешний.
- NoSQL: Key‑Value, Документные, Колонночные, Графовые.

## Раздел 2. Проектирование схем и нормализация
- НФ 1‑3, денормализация для чтения; ограничения целостности и внешние ключи.

## Раздел 3. Базовый SQL
- `CREATE TABLE`, `INSERT`, `SELECT`, `UPDATE`, `DELETE`.
```sql
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INT,
  created_at TIMESTAMP DEFAULT now()
);
INSERT INTO users(name,age) VALUES ('Ann',30);
SELECT id,name FROM users WHERE age >= 18 ORDER BY id;
```

## Раздел 4. JOIN, агрегации, группировки
- `INNER/LEFT/RIGHT JOIN`, `GROUP BY`, `HAVING`, агрегаты `COUNT/SUM/MAX`.
```sql
SELECT u.name, COUNT(o.id) AS orders
FROM users u LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.name HAVING COUNT(o.id) > 0;
```

## Раздел 5. Подзапросы и CTE
- Подзапросы в `SELECT/WHERE`, `WITH` (CTE), рекурсивные CTE.
```sql
WITH top_users AS (
  SELECT id FROM users WHERE age >= 18 LIMIT 100
)
SELECT * FROM orders WHERE user_id IN (SELECT id FROM top_users);
```

## Раздел 6. Индексы и планы
- B‑tree, Hash, GIN/GiST; `EXPLAIN (ANALYZE)`; селективность/кардинальность.
- Составные индексы: порядок колонок имеет значение.

## Раздел 7. Окна и аналитика
- Оконные функции: `ROW_NUMBER`, `RANK`, `SUM() OVER (PARTITION BY ...)`.
```sql
SELECT id, amount, SUM(amount) OVER (PARTITION BY user_id ORDER BY id) AS running
FROM payments WHERE user_id = 1;
```

## Раздел 8. Транзакции и изоляция
- ACID, уровни изоляции (`READ COMMITTED`…`SERIALIZABLE`), блокировки.
```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id=1;
UPDATE accounts SET balance = balance + 100 WHERE id=2;
COMMIT;
```

## Раздел 9. UPSERT и конфликтные ключи
- PostgreSQL: `INSERT ... ON CONFLICT (key) DO UPDATE`.

## Раздел 10. JSON и полу‑структурированные данные (SQL)
- Тип `JSON/JSONB` (PostgreSQL), индексы, операции `->`, `->>`.
```sql
SELECT payload->>'type' AS t FROM events WHERE (payload->>'user') = 'u1';
```

## Раздел 11. Key‑Value (Redis)
- `SET/GET/INCR/EXPIRE`, структуры: списки/множества/хэши/строки.
```text
SET visits 0
INCR visits
GET visits
```

## Раздел 12. Документные (MongoDB)
- Коллекции/документы, индексы, агрегирующий конвейер.
```javascript
// mongosh
db.users.insertOne({name:"Ann", age:30, tags:["pro","vip"]})
db.users.find({ age: { $gte: 18 } }, { _id:0, name:1 })
db.users.aggregate([{ $match:{ age:{ $gte:18 } } }, { $group:{ _id:null, cnt:{ $sum:1 } } }])
```

## Раздел 13. Колонночные (Cassandra)
- CQL, кластеры/ключевые пространства/таблицы, модель по запросам.
```sql
CREATE KEYSPACE shop WITH replication = {'class':'SimpleStrategy','replication_factor':1};
CREATE TABLE shop.users (id UUID PRIMARY KEY, name text, age int);
INSERT INTO shop.users (id,name,age) VALUES (uuid(), 'Ann', 30);
SELECT name FROM shop.users WHERE id = ?;
```

## Раздел 14. Графовые
- Узлы/рёбра/свойства; запросы Gremlin, Cypher (Neo4j).
```cypher
MERGE (u:User {name:'Ann'})-[:BOUGHT]->(:Item {sku:'X'})
MATCH (u:User)-[:BOUGHT]->(i:Item) RETURN i.sku;
```

## Раздел 15. Репликация, шардирование, консистентность
- CAP: Consistency/Availability/Partition tolerance; ACID vs BASE.
- Master‑replica, leaderless (Dynamo), кворумы.

## Раздел 16. Паттерны
- Индекс‑покрытие, партиционирование, CQRS, Event Sourcing.

## Раздел 17. ORM и миграции
- Flyway/Liquibase; ORM: Hibernate/EF/SQLAlchemy/TypeORM/Prisma.

## Раздел 18. Тестирование, профилирование, мониторинг
- Фикстуры, testcontainers, `EXPLAIN`, профайлеры, observability (Prometheus/Grafana).

## Раздел 19. Бэкапы и восстановление
- Snapshot/Point‑in‑Time Recovery, cold/hot backup.

## Раздел 20. Подводные камни
- Неверный порядок колонок в составном индексе, `SELECT *` в проде, N+1 запросы.
- В Mongo — чрезмерная вложенность документов вместо референсов.
- В Cassandra — ключ партиции не по запросам → горячие партиции.

## Раздел 21. Ресурсы
- Use The Index, Luke; PostgreSQL docs; MongoDB docs; Designing Data‑Intensive Applications.
