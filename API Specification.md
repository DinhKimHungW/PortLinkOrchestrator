# API Specification (REST, JSON)
PortLink Orchestrator — v1.0 Demo (Node.js Backend)

Base URL (dev): http://localhost:8000
Auth: JWT Bearer. Header: Authorization: Bearer <token>
Locale: Header Accept-Language: vi | en
Backend: Node.js HTTP server (no external deps). Data store: JSON files under backend/data/.
Frontend: Static Vue 3 app consuming these APIs.

---

## 1. Auth & User
### POST /auth/login
- Body: { "username": string, "password": string }
- 200: { "access_token": string, "token_type": "bearer", "role": "OPS|Driver|Admin" }
- 401: invalid credentials

### GET /me
- Auth required
- 200: { "userId": number, "username": string, "role": string }

RBAC summary:
- Admin: quản trị user, assets
- OPS: dashboard full (schedule, kpi, logs)
- Driver: incident form, xem nhiệm vụ của mình

---

## 2. Assets
### GET /assets
- Query: type?=Berth|Crane|Truck, status?
- 200: [ { assetId, name, type, status } ]

### POST /assets (Admin)
- Body: { name, type, status }
- 201: { assetId, ... }

### PUT /assets/{assetId} (Admin)
- Body: { name?, type?, status? }
- 200: updated object

---

## 3. Ship Visits & Tasks
### GET /visits
- 200: [ { visitId, shipName, eta_original, eta_actual, status } ]

### POST /visits (Admin)
- Body: { shipName, eta_original }
- 201: created visit

### GET /tasks
- Query: assetId?, visitId?, from?, to?
- 200: [ { taskId, visitId, assetId, startTime, endTime, type } ]

### POST /tasks (Admin/OPS)
- Body: { visitId, assetId, startTime, endTime, type }
- 201: created task

---

## 4. Schedule
### GET /schedule/active
- 200: { scheduleId, version, createdAt, tasks: [ ...task ] }

### POST /schedule/activate (Admin/OPS)
- Body: { scheduleId }
- 200: { ok: true }

### GET /schedule?from=&to=
- 200: { version, tasks: [ ... ] }

---

## 5. Incidents & Engine
### POST /incidents (OPS/Driver)
- Body: {
  "type": "ShipDelay|Weather|CraneDown|BerthMaintenance",
  "affected": { "visitId"?: number, "assetId"?: number },
  "delayMinutes"?: number,
  "reason"?: string
}
- 202: { "accepted": true, "incidentId": number }

Processing:
- Backend (Node) ghi EventLog (JSON), gọi Greedy Engine để cập nhật lịch, sinh phiên bản mới, log thay đổi.

### POST /engine/recalculate (Admin/OPS)
- Body: { "from"?: datetime, "assets"?: [assetId] }
- 202: { started: true }

---

## 6. Logs & KPIs
### GET /logs
- Query: limit=50 (default), from?, to?, type?
- 200: [ { logId, timestamp, userId, eventType, description, affected_assetId, affected_visitId } ]

### GET /logs/export.csv (OPS/Admin)
- Response: text/csv; UTF-8 BOM

### GET /kpis
- 200: {
  "conflictRate": number,        // % xung đột
  "avgWaitingMinutes": number,   // thời gian chờ trung bình
  "berthUtilization": number     // % sử dụng bến
}

---

## 7. Error & Status Model
- 400: { error: "BadRequest", details?: string }
- 401: { error: "Unauthorized" }
- 403: { error: "Forbidden" }
- 404: { error: "NotFound" }
- 409: { error: "Conflict", details?: string }
- 500: { error: "InternalServerError", traceId?: string }

---

## 8. Examples
Login:
- Request: { "username":"ops01", "password":"***" }
- Response: { "access_token": "eyJ...", "token_type":"bearer", "role":"OPS" }

Incident (Ship A trễ 60 phút):
- Body: { "type":"ShipDelay", "affected":{"visitId":1}, "delayMinutes":60, "reason":"Technical issue" }
- Result: 202 + logs; schedule active cập nhật tasks

---

## 9. Versioning & Compatibility
- v1 APIs phục vụ demo; thay đổi tương thích ngược sẽ thêm trường mới.
- Breaking changes sẽ nâng /v2 và có thông báo.
