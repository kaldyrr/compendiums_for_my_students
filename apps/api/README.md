# Course API MVP

No-dependency Node server for the first local MVP. It serves the JS builder prototype and exposes account, invite, moderation and billing contracts.

Run:

```bash
copy .env.example .env
npm run dev:api
```

Open:

```text
http://localhost:3000
```

Useful endpoints:

```text
GET  /api/health
POST /api/auth/telegram/request
POST /api/auth/telegram/verify
POST /api/admin/invites
GET  /api/admin/users
POST /api/admin/users/grant
POST /api/billing/platega/create
POST /api/billing/platega/webhook
```

Admin endpoints require:

```text
X-Admin-Token: value from ADMIN_BOOTSTRAP_TOKEN
```

Without `TELEGRAM_GATEWAY_TOKEN`, Telegram verification works in dev mode with code `000000`.

Without Platega credentials, payment creation returns a local dev payment URL.

Current assumptions checked against:

- Telegram Gateway API: `sendVerificationMessage`, `checkVerificationStatus`, Bearer token auth.
- Platega API: `v2/transaction/process`, `X-MerchantId`, `X-Secret`, callback statuses `CONFIRMED`, `CANCELED`, `CHARGEBACKED`.
