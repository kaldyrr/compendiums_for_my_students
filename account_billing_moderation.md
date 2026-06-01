# Аккаунты, модерация и платежи

Ревизия: 2026-06-01.

Цель: заложить модель, где свои студенты получают максимальный план бесплатно, а внешние пользователи проходят регистрацию, получают минимальный бесплатный функционал и могут оплатить расширенный доступ.

---

## 1. Роли

- `user`: обычный зарегистрированный пользователь.
- `student`: студент, которому выдали учебный доступ.
- `teacher`: преподаватель или куратор группы.
- `moderator`: может проверять аккаунты, блокировать, выдавать/отнимать учебный доступ.
- `admin`: полный доступ к пользователям, тарифам, платежам и контенту.

---

## 2. Планы

- `FREE`: минимальный бесплатный функционал для внешних людей.
- `PRO`: платный индивидуальный план.
- `MAX`: максимальный доступ, который можно купить или выдать вручную студентам.
- `INTERNAL_STUDENT_MAX`: бесплатный MAX-доступ для ваших студентов с пометкой, кто выдал и почему.

План хранится не только как строка, а как grant:
- `plan`;
- `source`: `free`, `paid`, `manual`, `invite`, `cohort`;
- `grantedBy`;
- `grantedAt`;
- `expiresAt`;
- `reason`.

---

## 3. Регистрация через Telegram Gateway

Telegram Gateway используется как phone verification, а не как полноценная авторизация через Telegram OAuth.

Поток:
1. Пользователь вводит телефон в формате E.164.
2. Backend вызывает Telegram Gateway `sendVerificationMessage`.
3. Пользователь вводит код.
4. Backend вызывает `checkVerificationStatus`.
5. Если статус `code_valid`, создается или активируется аккаунт.
6. Новый внешний пользователь получает `FREE`.
7. Если телефон/инвайт относится к студенту, применяется `INTERNAL_STUDENT_MAX`.

Важно:
- Gateway token хранится только на backend.
- callback от Telegram проверяется через HMAC подпись.
- Для теста можно отправлять коды на свой номер бесплатно, но для студентов потребуется пополненный Telegram Gateway account.

---

## 4. Студенческий доступ

Поддерживаем два способа:

1. Ручная выдача:
   - admin/moderator находит пользователя;
   - выдает `INTERNAL_STUDENT_MAX`;
   - указывает причину, группу и срок.

2. Инвайт:
   - admin создает invite code для группы;
   - студент регистрируется через Telegram;
   - вводит invite code;
   - получает `INTERNAL_STUDENT_MAX`.

Для вуза удобнее начать с invite codes по группам: `JS-2026-GROUP-1`, `CPP-2026-GROUP-2` и т.п.

---

## 5. Платежи через Platega

Пока аккаунт в Platega не создан, интеграция должна быть adapter-first:
- один интерфейс `createPayment`;
- один webhook endpoint;
- таблица `payment_transactions`;
- выдача доступа только после подтвержденного webhook/status check.

Поток:
1. Пользователь выбирает `PRO` или `MAX`.
2. Backend создает транзакцию в Platega.
3. Пользователь переходит по payment URL.
4. Platega отправляет callback.
5. Backend проверяет `X-MerchantId` и `X-Secret`.
6. При `CONFIRMED` выдает paid grant.
7. При `CANCELED` или `CHARGEBACKED` фиксирует статус и не выдает/отзывает доступ.

Platega требует публичный HTTPS callback с корректным SSL. Localhost и приватные IP для callback не подойдут.

---

## 6. Модерация

Минимальная админка:
- список пользователей;
- поиск по телефону, Telegram request id, invite, группе;
- блокировка аккаунта;
- ручная выдача/отзыв плана;
- просмотр платежей;
- просмотр попыток runner;
- audit log всех admin-действий.

Все ручные действия пишутся в audit log. Для учебного продукта это критично: нужно понимать, кто и почему выдал бесплатный максимальный доступ.

---

## 7. MVP endpoints

```text
POST /api/auth/telegram/request
POST /api/auth/telegram/verify
POST /api/invites/redeem

GET  /api/me

GET  /api/admin/users
POST /api/admin/invites
POST /api/admin/users/grant
POST /api/admin/users/block

POST /api/billing/platega/create
POST /api/billing/platega/webhook
```

Admin endpoints защищаются отдельным bootstrap token на MVP. Позже заменяем на нормальные admin sessions + 2FA.

---

## 8. Проверенные источники API

- Telegram Gateway API: `https://core.telegram.org/gateway/api`.
- Telegram Gateway quick-start: `https://core.telegram.org/gateway/verification-tutorial`.
- Platega API auth: `https://docs.platega.io/`.
- Platega create payment link: `https://docs.platega.io/создание-платежной-ссылки-без-заданного-метода-33845703e0`.
- Platega callback: `https://docs.platega.io/callback-об-изменении-статуса-транзакции-29209725e0`.
