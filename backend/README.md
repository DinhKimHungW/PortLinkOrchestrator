# PortLink Backend (Mock API)

A lightweight Express server that provides mock endpoints consumed by the frontend.

## Endpoints

- POST `/auth/login` { username, password } -> { token, user }
- GET  `/auth/me` -> user (requires Authorization: Bearer token)
- GET  `/schedule/active` -> { version, updatedAt, tasks }
- GET  `/schedule` -> tasks[]
- POST `/engine/recalculate` -> { ok, added, total }
- POST `/incidents` -> created incident
- GET  `/kpis` -> KPI metrics
- GET  `/assets` -> assets[]
- GET  `/visits` -> visits[]
- GET  `/logs` -> logs[]
- GET  `/logs/export.csv` -> CSV

## Quickstart

1. Copy env

```powershell
Copy-Item .env.example .env
```

2. Install and run

```powershell
npm install
npm run dev
```

Server will listen on http://localhost:8000

Default user: `admin` / `admin123`
