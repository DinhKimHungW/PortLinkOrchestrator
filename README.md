# PortLink Orchestrator

**Digital Maestro for Smart Port Operations**  
_Nhạc trưởng số cho cảng biển thông minh_

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/PortLinkOrchestrator)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.3.1-61dafb.svg)](https://reactjs.org/)

---

## 📋 Mục lục / Table of Contents

1. [Giới thiệu tổng quan / System Overview](#giới-thiệu-tổng-quan--system-overview)
2. [Kiến trúc hệ thống / System Architecture](#kiến-trúc-hệ-thống--system-architecture)
3. [Công nghệ sử dụng / Technology Stack](#công-nghệ-sử-dụng--technology-stack)
4. [Luồng dữ liệu & Workflow / Data Flow & Workflows](#luồng-dữ-liệu--workflow--data-flow--workflows)
5. [Tính năng chi tiết / Features Documentation](#tính-năng-chi-tiết--features-documentation)
6. [Hướng dẫn sử dụng theo vai trò / Role-Based User Guides](#hướng-dẫn-sử-dụng-theo-vai-trò--role-based-user-guides)
7. [Cài đặt & Triển khai / Installation & Deployment](#cài-đặt--triển-khai--installation--deployment)
8. [API Documentation](#api-documentation)
9. [Troubleshooting & FAQ](#troubleshooting--faq)
10. [Đóng góp / Contributing](#đóng-góp--contributing)

---

## Giới thiệu tổng quan / System Overview

### 🎯 Mục tiêu / Purpose

**PortLink Orchestrator** là hệ thống điều phối và quản lý vận hành cảng biển thông minh, được thiết kế để:

- **Tối ưu hóa lịch trình**: Tự động xếp lịch và điều phối tài sản cảng (bến, cẩu, xe kéo, v.v.) dựa trên lượt tàu cập cảng
- **Xử lý sự cố realtime**: Phát hiện, báo cáo và tái tính toán lịch trình khi có sự cố (tàu trễ, thiết bị hỏng, thời tiết xấu)
- **Giám sát toàn diện**: Dashboard 3D digital twin + KPI metrics + notification center
- **Hỗ trợ đa vai trò**: Admin (quản trị), OPS (điều phối viên), Driver (lái xe/nhân viên hiện trường)

### 🌟 Điểm nổi bật / Key Features

1. **Gantt Schedule Visualization** - Biểu đồ Gantt hiển thị lịch trình realtime với Plotly.js
2. **3D Digital Twin** - Mô phỏng cảng 3D với Three.js
3. **Incident Management** - Báo cáo sự cố → tự động tái tính lịch trình
4. **Asset Portfolio** - Giám sát tình trạng và mức sử dụng tài sản
5. **Visit Tracking** - Theo dõi lượt tàu cập/rời cảng theo thời gian thực
6. **KPI Dashboard** - Chỉ số vận hành: conflict rate, waiting time, berth utilization
7. **Activity Logs** - Nhật ký hệ thống với export CSV
8. **Multi-language** - Hỗ trợ Tiếng Việt / English
9. **Dark/Light Theme** - Giao diện sáng/tối

### 🎭 Vai trò người dùng / User Roles

| Vai trò | Quyền hạn | Chức năng chính |
|---------|-----------|-----------------|
| **Admin** | Toàn quyền quản trị | Tạo/sửa tài sản, lượt tàu, kích hoạt lịch trình, xem toàn bộ báo cáo |
| **OPS** (Operations) | Điều phối vận hành | Báo cáo sự cố, tạo task, tái tính lịch trình, xem KPI/logs |
| **Driver** | Hiện trường | Báo cáo sự cố nhanh qua mobile UI, xem lịch trình cá nhân |

---

## Kiến trúc hệ thống / System Architecture

### 🏗️ Sơ đồ kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React 18 + Redux Toolkit SPA                            │   │
│  │  ├─ Dashboard (Gantt, KPI, 3D Twin, Incident Form)       │   │
│  │  ├─ Assets Page (Portfolio + Utilization Analytics)      │   │
│  │  ├─ Visits Page (List/Calendar View + Status Badges)     │   │
│  │  ├─ Incidents Page (Filters, Pagination, Details)        │   │
│  │  ├─ Report Page (Mobile Quick Incident Submission)       │   │
│  │  └─ Auth (Login, JWT Storage, Private Routes)            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ▲                                   │
│                              │ REST API (Axios)                  │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │             Vite Dev Server (5173)                        │   │
│  │         Tailwind CSS + PostCSS Build Pipeline            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVER LAYER                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Node.js + Express API Server (Port 3000)                │   │
│  │  ├─ Routes:                                               │   │
│  │  │   ├─ /auth/login (POST) - JWT authentication          │   │
│  │  │   ├─ /auth/me (GET) - Get current user                │   │
│  │  │   ├─ /api/assets (GET, POST, PUT) - Asset CRUD        │   │
│  │  │   ├─ /api/visits (GET, POST) - Visit management       │   │
│  │  │   ├─ /api/tasks (GET, POST) - Task creation           │   │
│  │  │   ├─ /api/schedule/active (GET) - Active schedule     │   │
│  │  │   ├─ /api/incidents (GET, POST) - Incident mgmt       │   │
│  │  │   ├─ /api/kpis (GET) - KPI metrics calculation        │   │
│  │  │   ├─ /api/logs (GET) + /logs/export.csv              │   │
│  │  │   └─ /api/engine/recalculate (POST) - Schedule calc   │   │
│  │  ├─ Middleware:                                           │   │
│  │  │   ├─ authenticate() - JWT verification                │   │
│  │  │   └─ authorize([roles]) - Role-based access control   │   │
│  │  └─ Services:                                             │   │
│  │      ├─ assetService - Asset business logic              │   │
│  │      ├─ visitService - Visit enrichment + decoration     │   │
│  │      ├─ taskService - Task validation + conflict check   │   │
│  │      ├─ scheduleService - Schedule versioning + recalc   │   │
│  │      ├─ incidentService - Incident + auto-recalc trigger │   │
│  │      ├─ kpiService - Conflict/waiting/utilization calc   │   │
│  │      ├─ logService - Activity logging + CSV export       │   │
│  │      └─ dataEnrichment - Task/visit/incident decoration  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ▲                                   │
│                              │ File I/O (JSON)                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         DATA LAYER (JSON File Store)                      │   │
│  │  backend/src/data/                                        │   │
│  │    ├─ users.json        - User accounts + hashed passwords│  │
│  │    ├─ assets.json       - 14 assets (berths, cranes, etc)│  │
│  │    ├─ visits.json       - 10 ship visits                 │   │
│  │    ├─ tasks.json        - 30 scheduled tasks              │   │
│  │    ├─ schedules.json    - 3 schedule versions            │   │
│  │    ├─ incidents.json    - 6 demo incidents                │   │
│  │    ├─ logs.json         - 20 activity logs                │   │
│  │    └─ meta.json         - Counters + timestamps           │   │
│  │                                                            │   │
│  │  dataStore.js - Mutex-protected read/write + seed data    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 🔄 Kiến trúc phân tầng / Layered Architecture

**Frontend (React SPA)**
```
pages/ (UI Components)
  ↓
store/ (Redux State Management)
  ↓
api/ (HTTP Client Services)
  ↓
Axios → Backend API
```

**Backend (Node.js API)**
```
routes/ (HTTP Endpoints)
  ↓
middleware/ (Auth + RBAC)
  ↓
services/ (Business Logic)
  ↓
lib/dataStore.js (Data Access Layer)
  ↓
JSON Files (Persistence)
```

---

## Công nghệ sử dụng / Technology Stack

### 🎨 Frontend

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **React** | 18.3.1 | UI framework, component-based architecture |
| **Redux Toolkit** | 2.5.0 | Centralized state management (assets, visits, schedules, incidents, KPIs, logs) |
| **React Router** | 7.1.1 | SPA routing, private route protection |
| **Axios** | 1.7.9 | HTTP client for API calls |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **Plotly.js** | 2.35.5 | Gantt chart visualization |
| **Three.js** | 0.171.0 | 3D digital twin rendering |
| **Vite** | 6.0.3 | Fast build tool + dev server |

**Key Libraries:**
- `clsx` - Conditional CSS class composition
- `date-fns` (optional) - Date manipulation utilities
- `react-plotly.js` - React wrapper for Plotly charts

### ⚙️ Backend

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **Node.js** | ≥18.0.0 | JavaScript runtime |
| **Express** | 5.0.1 | Web framework, REST API routing |
| **jsonwebtoken** | 9.0.2 | JWT authentication |
| **csv-stringify** | 6.5.2 | CSV export for logs |
| **cors** | 2.8.5 | Cross-origin resource sharing |

**Architecture Patterns:**
- **Service Layer** - Business logic separation
- **Middleware Chain** - Auth → RBAC → Route Handler
- **Mutex Locks** - File write concurrency control
- **Repository Pattern** - dataStore.js abstracts JSON file I/O

### 🗄️ Data Storage

- **File-based JSON Store** - Lightweight, no DB setup required
- **Atomic Writes** - Mutex ensures consistency
- **Seed Data Generators** - Auto-populate demo data on first run
- **ID Counters** - Monotonic ID generation via `meta.json`

---

## Luồng dữ liệu & Workflow / Data Flow & Workflows

### 🔐 Workflow 1: Authentication Flow

```
┌─────────────┐
│ User enters │
│ credentials │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────┐
│ POST /auth/login                     │
│ { username, password }               │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Backend:                             │
│ 1. Hash password (SHA-256)           │
│ 2. Find user in users.json           │
│ 3. Compare hashes                    │
└──────┬───────────────────────────────┘
       │
       ├─── Success ──────────────────┐
       │                              │
       ▼                              ▼
┌────────────────────┐      ┌─────────────────────┐
│ Generate JWT token │      │ Return error 401    │
│ { userId, role }   │      │ "Invalid login"     │
└────────┬───────────┘      └─────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Frontend:                          │
│ 1. Store token in localStorage     │
│ 2. Set Authorization header        │
│ 3. Redirect to /dashboard          │
└────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ GET /auth/me                       │
│ Header: Authorization: Bearer XXX  │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Middleware: authenticate()         │
│ - Verify JWT signature             │
│ - Decode { userId, role }          │
│ - Attach req.user                  │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Return user object                 │
│ { userId, username, role }         │
└────────────────────────────────────┘
```

**Demo Accounts:**
```javascript
// Admin
username: admin
password: admin123

// Operations
username: ops01
password: ops123

// Driver
username: driver01
password: driver123
```

### 📦 Workflow 2: Asset Management (CRUD)

```
┌─────────────────────────────────────────────────────────────┐
│ Admin creates new asset                                     │
│ POST /api/assets                                            │
│ { name: "Berth Delta", type: "Berth", status: "Active" }   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ authorize(['Admin']) middleware                             │
│ → Checks req.user.role === 'Admin'                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ assetService.createAsset()                                  │
│ 1. Validate type (Berth, Crane, Vehicle, etc.)             │
│ 2. Check name uniqueness                                    │
│ 3. Generate assetId via nextId('assets')                    │
│ 4. Save to assets.json                                      │
│ 5. Log event → logs.json                                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Update meta.json counters                                   │
│ { counters: { assets: 15, ... }, updatedAt: ISO }          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Return created asset                                        │
│ { assetId: 15, name: "Berth Delta", type: "Berth", ... }   │
└─────────────────────────────────────────────────────────────┘
```

**Asset Types:**
- `Berth` - Bến cập tàu
- `Crane` - Cẩu container
- `Vehicle` - Xe kéo/forklift
- `Warehouse` - Kho bãi
- `Support` - Tàu lai dắt
- `Storage` - Racks/yard storage
- `Gate` - Cổng ra vào

**Asset Status:**
- `Active` - Đang hoạt động
- `Maintenance` - Đang bảo trì
- `Idle` - Nhàn rỗi
- `OutOfService` - Ngừng hoạt động

### 🚢 Workflow 3: Visit Scheduling & Task Assignment

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Create Ship Visit                                  │
│ POST /api/visits                                            │
│ { shipName: "MV Ocean Star",                               │
│   eta_original: "2025-11-03T08:00:00Z" }                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ visitService.createVisit()                                  │
│ → Generates visitId: 11                                     │
│ → Sets status: "Scheduled"                                  │
│ → Saves to visits.json                                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Create Tasks for Visit                             │
│ POST /api/tasks                                             │
│ { visitId: 11, assetId: 1, type: "Berthing",               │
│   startTime: "2025-11-03T07:45:00Z",                       │
│   endTime: "2025-11-03T08:45:00Z" }                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ taskService.createTask()                                    │
│ 1. Validate visitId + assetId exist                         │
│ 2. Check time window (endTime > startTime)                 │
│ 3. Detect conflicts with existing tasks (same asset)       │
│    → overlaps() function checks time intersection          │
│ 4. Generate taskId via nextId('tasks')                      │
│ 5. Save to tasks.json                                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Schedule Version Created                           │
│ scheduleService.getActiveSchedule()                         │
│ → Reads tasks.json                                          │
│ → Creates schedule version if not exists                    │
│ → Enriches tasks with asset/visit metadata                 │
└─────────────────────────────────────────────────────────────┘
```

**Task Types:**
- `Berthing` - Cập bến
- `Loading` - Bốc hàng
- `Unloading` - Dỡ hàng

**Conflict Detection:**
```javascript
function overlaps(taskA, taskB) {
  const startA = new Date(taskA.startTime).getTime();
  const endA = new Date(taskA.endTime).getTime();
  const startB = new Date(taskB.startTime).getTime();
  const endB = new Date(taskB.endTime).getTime();
  return startA < endB && endA > startB;
}
```

### 🚨 Workflow 4: Incident Reporting & Auto-Recalculation

```
┌─────────────────────────────────────────────────────────────┐
│ User reports incident via Dashboard or Mobile Report Page  │
│ POST /api/incidents                                         │
│ { type: "ShipDelay",                                        │
│   affected: { visitId: 4, assetId: 1 },                    │
│   delayMinutes: 30,                                         │
│   reason: "Heavy fog at channel entrance" }                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ incidentService.createIncident()                            │
│ 1. Validate incident type (ShipDelay, Weather, CraneDown,  │
│    BerthMaintenance)                                        │
│ 2. Generate incidentId via nextId('incidents')              │
│ 3. Set status: "Open", createdAt, reportedBy                │
│ 4. Save to incidents.json                                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Auto-trigger recalculateSchedule()                          │
│ Parameters:                                                 │
│ - visitId: 4 (if ship delay)                               │
│ - assetId: 1 (if asset affected)                           │
│ - delayMinutes: 30                                          │
│ - reason: "Incident 7"                                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ scheduleService.recalculateSchedule()                       │
│ 1. Load current tasks from tasks.json                       │
│ 2. Apply time shifts:                                       │
│    a) All tasks for visitId → shift +30 minutes            │
│    b) All tasks for assetId → shift +5 minutes             │
│    c) Tasks after timestamp → shift +10 minutes            │
│ 3. Save updated tasks to tasks.json                         │
│ 4. Create new schedule version (version++)                 │
│ 5. Set new version as active                                │
│ 6. Log: SCHEDULE_VERSION_CREATED, SCHEDULE_ACTIVATED        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Return response:                                            │
│ { accepted: true,                                           │
│   incidentId: 7,                                            │
│   scheduleId: 4,                                            │
│   version: 4 }                                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend reloads:                                           │
│ - fetchActiveSchedule() → updates Gantt chart               │
│ - fetchIncidents() → refreshes incident list                │
│ - fetchKpis() → recalculates metrics                        │
│ - fetchLogs() → shows new log entries                       │
└─────────────────────────────────────────────────────────────┘
```

**Incident Types:**
- `ShipDelay` - Tàu cập cảng trễ
- `Weather` - Thời tiết xấu
- `CraneDown` - Cẩu gặp sự cố
- `BerthMaintenance` - Bến bảo trì

**Recalculation Strategy:**
```javascript
// Visit delay: shift all tasks for that visit
if (visitId && delayMinutes) {
  tasks.map(task => {
    if (task.visitId === visitId) {
      task.startTime = shiftIso(task.startTime, delayMinutes);
      task.endTime = shiftIso(task.endTime, delayMinutes);
    }
  });
}

// Asset downtime: shift tasks using that asset
if (assetIds && assetIds.length) {
  tasks.map(task => {
    if (assetIds.includes(task.assetId)) {
      task.startTime = shiftIso(task.startTime, 5); // buffer
      task.endTime = shiftIso(task.endTime, 5);
    }
  });
}

// Global shift: tasks after timestamp
if (from) {
  tasks.map(task => {
    if (new Date(task.startTime) >= new Date(from)) {
      task.startTime = shiftIso(task.startTime, 10);
      task.endTime = shiftIso(task.endTime, 10);
    }
  });
}
```

### 📊 Workflow 5: KPI Calculation

```
┌─────────────────────────────────────────────────────────────┐
│ Dashboard requests KPIs                                     │
│ GET /api/kpis                                               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ kpiService.getKpis()                                        │
│ Loads: tasks.json + assets.json + visits.json              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ METRIC 1: Conflict Rate                                    │
│ - Group tasks by assetId                                    │
│ - Sort each group by startTime                              │
│ - Count overlaps: task[i].endTime > task[i+1].startTime    │
│ - conflictRate = conflictCount / totalAssignments           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ METRIC 2: Average Waiting Time                             │
│ - Group tasks by visitId                                    │
│ - Calculate gaps between sequential tasks                   │
│ - avgWaitingMinutes = sum(gaps) / gapCount                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ METRIC 3: Berth Utilization                                │
│ - Filter assets where type === "Berth"                      │
│ - Sum task durations for those berths                       │
│ - berthUtilization = totalMinutes / (24h * berthCount)      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Return JSON:                                                │
│ { conflictRate: 0.03,                                       │
│   avgWaitingMinutes: 12.5,                                  │
│   berthUtilization: 0.68,                                   │
│   totals: { visits: 10, tasks: 30, assets: 14 } }          │
└─────────────────────────────────────────────────────────────┘
```

### 📝 Workflow 6: Activity Logging & Export

```
┌─────────────────────────────────────────────────────────────┐
│ Any service operation triggers logging:                     │
│ appendLog({ userId, eventType, description, ... })          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ logService.appendLog()                                      │
│ 1. Generate logId via nextId('logs')                        │
│ 2. Attach timestamp: new Date().toISOString()               │
│ 3. Prepend to logs array (newest first)                     │
│ 4. Save to logs.json                                        │
└─────────────────────────────────────────────────────────────┘

Event Types:
├─ SYSTEM_INIT
├─ USER_LOGIN
├─ ASSET_CREATED / ASSET_UPDATED
├─ VISIT_CREATED
├─ TASK_CREATED
├─ INCIDENT_REPORTED / INCIDENT_RESOLVED
├─ SCHEDULE_VERSION_CREATED / SCHEDULE_ACTIVATED
└─ INCIDENT_PROCESSING_FAILED

┌─────────────────────────────────────────────────────────────┐
│ Export logs as CSV                                          │
│ GET /api/logs/export.csv                                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ logService.getAllLogs() → load all logs                     │
│ stringify({ header: true, columns: [...] })                 │
│ → CSV string                                                │
│ Set Content-Type: text/csv                                  │
│ Set Content-Disposition: attachment; filename="logs.csv"    │
└─────────────────────────────────────────────────────────────┘
```

---

## Tính năng chi tiết / Features Documentation

### 1️⃣ Dashboard / Trang điều phối

**Mô tả**: Trang chính tổng hợp toàn bộ thông tin vận hành realtime.

**Components:**

#### 📊 Operations Snapshot Card
Hiển thị tổng quan nhanh về:
- **Sự cố đang mở** - Số lượng incident chưa xử lý / tổng số / đã giải quyết
- **Tài sản hoạt động** - Số asset đang active / tổng số / nhàn rỗi
- **Công việc đang chạy** - Tasks đang thực hiện / tổng số / số lượt tàu
- **Đang bảo trì** - Assets ở trạng thái Maintenance/OutOfService
- **Lượt tàu tiếp theo** - Thông tin tàu sắp cập cảng (shipName, berth, ETA)

**Data Sources:**
```javascript
// Computed from Redux store
incidents.filter(inc => inc.statusLower !== 'resolved').length
assets.filter(a => a.status === 'Active').length
schedules.filter(task => task.lifecycle === 'InProgress').length
visits.sort((a,b) => a.startTime - b.startTime)[0]
```

#### 📈 Gantt Schedule Chart
**Library**: Plotly.js horizontal bar chart with date x-axis

**Features:**
- Hiển thị timeline của tất cả tasks
- Màu sắc phân biệt theo asset
- Hover tooltip: shipName, asset, start/end time
- Auto-refresh khi schedule thay đổi

**Data Structure:**
```javascript
{
  type: 'bar',
  orientation: 'h',
  x: [duration_ms_array],        // Task durations
  base: [startTime_array],        // Task start times
  y: [assetName_array],           // Y-axis labels
  text: [tooltip_array],          // Hover text
  marker: { color: [...], opacity: 0.85 }
}
```

#### 🔔 Notification Center
**Features:**
- Hiển thị 10 logs gần nhất
- Export toàn bộ logs ra CSV
- Realtime update khi có event mới
- Filter by eventType (optional)

**Event Types Displayed:**
- INCIDENT_REPORTED
- INCIDENT_RESOLVED
- TASK_CREATED
- SCHEDULE_ACTIVATED
- USER_LOGIN
- v.v.

**Export CSV:**
```
GET /api/logs/export.csv
→ Download logs.csv với headers:
logId, timestamp, userId, eventType, description, affected_assetId, affected_visitId
```

#### 📊 KPI Grid
Hiển thị 3 chỉ số quan trọng:

| KPI | Formula | Good Value | Display |
|-----|---------|------------|---------|
| **Conflict Rate** | `conflicts / total_assignments` | < 5% | `3.2%` (rose badge) |
| **Avg Waiting Time** | `sum(gaps) / gap_count` | < 15 min | `12 min` (amber badge) |
| **Berth Utilization** | `used_minutes / (24h * berth_count)` | 60-80% | `68%` (emerald badge) |

#### 🏗️ 3D Digital Twin (Dock3DScene)
**Library**: Three.js + WebGL

**Components:**
- **Camera**: Perspective camera với orbit controls
- **Lighting**: Ambient + directional lights
- **Geometry**: 
  - Berths: BoxGeometry màu xanh
  - Cranes: CylinderGeometry màu vàng
  - Grid helper cho đáy cảng
- **Animation Loop**: requestAnimationFrame cho rotation effect

**User Interaction:**
- Mouse drag để xoay camera
- Scroll để zoom in/out
- Auto-rotate mode (optional)

#### 📝 Incident Report Form
**Fields:**
- `type` (select) - ShipDelay, Weather, CraneDown, BerthMaintenance
- `affected.visitId` (select) - Chọn lượt tàu bị ảnh hưởng
- `affected.assetId` (select) - Chọn tài sản bị ảnh hưởng
- `delayMinutes` (number) - Thời gian trễ dự kiến
- `reason` (textarea) - Mô tả chi tiết

**Validation:**
- `type` là required
- `delayMinutes` >= 0
- Ít nhất một trong `visitId` hoặc `assetId` phải có giá trị

**Submit Flow:**
```javascript
POST /api/incidents
→ createIncident()
→ Auto recalculateSchedule()
→ Frontend reloads: schedules, incidents, KPIs, logs
→ Show success toast: "Sự cố đã được gửi và hệ thống đang tối ưu lịch trình"
```

---

### 2️⃣ Assets Page / Quản lý tài sản

**URL**: `/assets`  
**Access**: All roles (Admin, OPS, Driver)

#### 🔍 Filters
- **Search** - Tìm kiếm theo tên asset
- **Type** - Lọc theo loại (All / Berth / Crane / Vehicle / Warehouse / Support / Storage / Gate)
- **Status** - Lọc theo trạng thái (All / Active / Maintenance / Idle / OutOfService)
- **Reset** - Xóa tất cả bộ lọc

#### 📊 Asset Cards
Mỗi asset hiển thị:
- **Header**: Name, ID, Type, Status badge
- **Health Badge**: Good (green) / Warning (yellow) / Critical (red)
  - Logic: 
    - OutOfService → Critical (red)
    - Maintenance/Idle → Warning (yellow)
    - Utilization < 33% → Critical
    - Utilization < 66% → Warning
    - Else → Good (green)
- **Metrics**:
  - **Utilization %** - `scheduledMinutes / (24h * 60)` capped at 100%
  - **Active Tasks** - Tasks có lifecycle === 'InProgress'
  - **Minutes Scheduled** - Tổng thời gian các tasks (unit: min)

#### 🔎 Asset Detail Modal
Click "Chi tiết" để xem:
- **Utilization Chart** (optional expansion)
- **Upcoming Visits** (top 3):
  - Ship name
  - Start time → End time
  - Primary berth
- **Recent Tasks** (top 5):
  - Task type (Berthing/Loading/Unloading)
  - Ship name
  - Duration
  - Start time

**Data Enrichment:**
```javascript
// Backend decorates tasks with:
{
  ...task,
  assetName: asset.name,
  assetType: asset.type,
  shipName: visit.shipName,
  durationMinutes: Math.round((endTime - startTime) / 60000),
  lifecycle: 'Queued' | 'InProgress' | 'Completed'
}
```

---

### 3️⃣ Visits Page / Lịch tàu cập cảng

**URL**: `/visits`  
**Access**: All roles

#### 📋 View Modes
**List View:**
- Table với columns:
  - Ship - Tên tàu
  - Asset - Bến/tài sản chính
  - ETA - Estimated Time of Arrival
  - ETD - Estimated Time of Departure
  - Duration - Tổng thời lượng
  - Status - Badge màu (Completed/InProgress/Queued/Delayed/Scheduled)

**Calendar View:**
- Group visits by date
- Card cho mỗi ngày hiển thị:
  - Số lượng visits trong ngày
  - List visits với ship name, time range, berth

#### 🎨 Status Badges
```javascript
const statusColors = {
  'completed': 'bg-emerald-100 text-emerald-700',
  'inprogress': 'bg-sky-100 text-sky-700',
  'queued': 'bg-amber-100 text-amber-700',
  'scheduled': 'bg-amber-100 text-amber-700',
  'delayed': 'bg-rose-100 text-rose-700',
  'default': 'bg-slate-200 text-slate-700'
}
```

**Lifecycle Calculation:**
```javascript
const now = Date.now();
const start = new Date(visit.startTime).getTime();
const end = new Date(visit.endTime).getTime();

if (now < start) return 'Queued';
if (now > end) return 'Completed';
return 'InProgress';
```

#### 📊 Visit Enrichment
Backend tự động tính toán:
- `startTime` - Earliest task.startTime
- `endTime` - Latest task.endTime
- `taskCount` - Số lượng tasks
- `durationMinutes` - Tổng thời gian
- `assetIds` - Mảng unique assetIds
- `assetName` - Danh sách tên assets (comma-separated)
- `primaryAssetId` - Asset của task đầu tiên
- `lifecycle` - Computed status

---

### 4️⃣ Incidents Page / Trung tâm sự cố

**URL**: `/incidents`  
**Access**: Admin, OPS

#### 🔍 Filters
- **Status** - All / Open / Resolved
- **Type** - All / ShipDelay / Weather / CraneDown / BerthMaintenance
- **Reset** - Xóa bộ lọc

#### 📋 Incidents Table
**Columns:**
- Time - Created timestamp
- Type - Incident type badge
- Asset - Affected asset name (or "—")
- Visit - Affected ship name (or "—")
- Delay - delayMinutes
- Reason - Description text
- Status - Open/InProgress/Resolved badge
- Actions - "Đánh dấu đã xử lý" button

**Pagination:**
- Items per page: 10
- Navigation: Previous / Next buttons
- Display: "Showing X-Y of Z"

#### ✅ Resolve Incident
```javascript
// Frontend action
dispatch(updateIncidentStatus({ id: incidentId, status: 'Resolved' }))

// API call (future enhancement - currently client-side only)
PATCH /api/incidents/:id
{ status: 'Resolved' }
```

**Current Behavior:**
- Status update chỉ ở Redux store (không persist)
- Cần backend endpoint để lưu vào `incidents.json`

#### 📊 Incident Enrichment
Backend returns:
```javascript
{
  ...incident,
  id: incident.incidentId,
  assetName: asset?.name,      // From assetMap
  assetType: asset?.type,
  shipName: visit?.shipName,   // From visitMap
  reportedByName: user?.username, // From userMap
  statusLower: status.toLowerCase()
}
```

---

### 5️⃣ Report Page / Báo cáo nhanh (Mobile)

**URL**: `/report`  
**Access**: All roles (optimized for Driver)  
**Purpose**: Simplified incident submission for field workers

**Features:**
- Large touch-friendly UI
- Simplified form (same fields as Dashboard form)
- "Mobile incident console" badge
- Success confirmation: "Đã tiếp nhận báo cáo. Điều phối viên sẽ xử lý ngay."

**Use Case:**
Driver phát hiện crane hỏng → mở `/report` trên điện thoại → chọn type "CraneDown", assetId, nhập lý do → submit → OPS nhận được incident realtime.

---

### 6️⃣ Schedule Management / Quản lý lịch trình

#### 📅 Schedule Versioning
**Concept**: Mỗi lần recalculate tạo schedule version mới

**Structure:**
```javascript
{
  scheduleId: 3,
  version: 3,
  createdAt: "2025-11-01T10:00:00Z",
  isActive: true,
  tasks: [...30 tasks]
}
```

**History:**
- Version 1: Initial schedule (15 tasks)
- Version 2: Manual adjustment (27 tasks)
- Version 3: After incident recalc (30 tasks) ← active

#### 🔄 Activation Flow
```javascript
POST /api/schedule/activate
{ scheduleId: 2 }

→ scheduleService.activateSchedule()
→ Set all schedules.isActive = false
→ Set selected.isActive = true
→ Copy selected.tasks → tasks.json
→ Log: SCHEDULE_ACTIVATED
```

**Use Case:**
Admin muốn rollback lại version cũ vì version mới có conflict → activate version 2 → tasks.json được restore.

#### 📊 Schedule Enrichment
Backend adds metadata:
```javascript
{
  scheduleId: 3,
  version: 3,
  tasks: [...], // Decorated tasks
  summary: {
    totalTasks: 30,
    assetsInUse: 14,
    visitsCovered: 10,
    totalScheduledMinutes: 1200,
    windowStart: "2025-10-29T04:50:00Z",
    windowEnd: "2025-10-30T05:20:00Z",
    activeNow: 2,
    assetIds: [1,2,3,4,...],
    visitIds: [1,2,3,...]
  }
}
```

**Frontend Usage:**
```javascript
const { summary } = useSelector(state => state.schedules);
console.log(`${summary.activeNow} tasks running now`);
console.log(`Using ${summary.assetsInUse} assets across ${summary.visitsCovered} visits`);
```

---

### 7️⃣ Authentication & Authorization

#### 🔐 JWT Authentication
**Token Structure:**
```javascript
{
  userId: 1,
  role: 'Admin',
  iat: 1698765432,
  exp: 1698851832  // 24h expiry
}
```

**Storage**: `localStorage.getItem('token')`

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 🛡️ Role-Based Access Control (RBAC)

**Middleware:**
```javascript
authorize(['Admin', 'OPS']) // Allow multiple roles

// In route:
router.post('/api/assets', 
  authenticate,           // Step 1: Verify JWT
  authorize(['Admin']),   // Step 2: Check role
  asyncHandler(createAsset) // Step 3: Execute
);
```

**Access Matrix:**

| Endpoint | Admin | OPS | Driver |
|----------|-------|-----|--------|
| GET /api/assets | ✅ | ✅ | ✅ |
| POST /api/assets | ✅ | ❌ | ❌ |
| PUT /api/assets/:id | ✅ | ❌ | ❌ |
| GET /api/visits | ✅ | ✅ | ✅ |
| POST /api/visits | ✅ | ❌ | ❌ |
| GET /api/tasks | ✅ | ✅ | ✅ |
| POST /api/tasks | ✅ | ✅ | ❌ |
| GET /api/schedule/* | ✅ | ✅ | ✅ |
| POST /api/schedule/activate | ✅ | ✅ | ❌ |
| POST /api/engine/recalculate | ✅ | ✅ | ❌ |
| GET /api/incidents | ✅ | ✅ | ❌ |
| POST /api/incidents | ✅ | ✅ | ✅ |
| GET /api/kpis | ✅ | ✅ | ❌ |
| GET /api/logs | ✅ | ✅ | ❌ |

#### 🔄 Token Refresh
**Current**: No auto-refresh (expire after 24h)

**Future Enhancement:**
```javascript
// Add refresh token endpoint
POST /auth/refresh
{ refreshToken: "..." }
→ Return new access token
```

---

### 8️⃣ Data Enrichment Layer

**Purpose**: Transform raw database entities into UI-ready objects with computed fields.

**Location**: `backend/src/services/dataEnrichment.js`

#### 🎯 Task Decoration
```javascript
decorateTask(task, { assetMap, visitMap }) {
  const asset = assetMap.get(task.assetId);
  const visit = visitMap.get(task.visitId);
  
  return {
    ...task,
    assetName: asset?.name,
    assetType: asset?.type,
    assetStatus: asset?.status,
    shipName: visit?.shipName,
    visitStatus: visit?.status,
    etaOriginal: visit?.eta_original,
    etaActual: visit?.eta_actual,
    durationMinutes: minutesBetween(task.startTime, task.endTime),
    lifecycle: computeLifecycle(task), // Queued/InProgress/Completed
    isActiveNow: lifecycle === 'InProgress'
  };
}
```

#### 🚢 Visit Decoration
```javascript
decorateVisit(visit, relatedTasks, { assetMap }) {
  const sortedTasks = relatedTasks.sort((a,b) => a.startTime - b.startTime);
  const startTask = sortedTasks[0];
  const endTask = sortedTasks[sortedTasks.length - 1];
  
  return {
    ...visit,
    id: visit.visitId,
    startTime: startTask?.startTime ?? visit.eta_original,
    endTime: endTask?.endTime ?? visit.eta_actual,
    taskCount: relatedTasks.length,
    durationMinutes: sum(tasks.map(t => t.durationMinutes)),
    assetIds: unique(tasks.map(t => t.assetId)),
    assetName: unique(tasks.map(t => t.assetName)).join(', '),
    primaryAssetId: startTask?.assetId,
    primaryAssetName: assetMap.get(startTask?.assetId)?.name,
    lifecycle: computeLifecycle(visit)
  };
}
```

#### 🚨 Incident Decoration
```javascript
decorateIncident(incident, { assetMap, visitMap, userMap }) {
  return {
    ...incident,
    id: incident.incidentId,
    assetName: assetMap.get(incident.affected.assetId)?.name,
    assetType: assetMap.get(incident.affected.assetId)?.type,
    shipName: visitMap.get(incident.affected.visitId)?.shipName,
    reportedByName: userMap.get(incident.reportedBy)?.username,
    statusLower: incident.status.toLowerCase()
  };
}
```

#### 📊 Schedule Summary
```javascript
summarizeTaskSet(tasks) {
  return {
    totalTasks: tasks.length,
    assetsInUse: unique(tasks.map(t => t.assetId)).length,
    visitsCovered: unique(tasks.map(t => t.visitId)).length,
    totalScheduledMinutes: sum(tasks.map(t => t.durationMinutes)),
    windowStart: min(tasks.map(t => t.startTime)),
    windowEnd: max(tasks.map(t => t.endTime)),
    activeNow: tasks.filter(t => t.lifecycle === 'InProgress').length,
    assetIds: unique(tasks.map(t => t.assetId)),
    visitIds: unique(tasks.map(t => t.visitId))
  };
}
```

---

### 9️⃣ Internationalization (i18n)

**Supported Languages:**
- `vi` - Tiếng Việt (default)
- `en` - English

**Implementation:**
- Context-based translation provider
- `useTranslation()` hook
- Language switcher in AppShell header

**Usage:**
```javascript
import { useTranslation } from '../i18n/LanguageProvider';

function Component() {
  const t = useTranslation();
  
  return (
    <h1>{t('dashboard.title')}</h1>
    <p>{t('dashboard.welcome', { name: 'John' })}</p>
  );
}
```

**Translation Keys Structure:**
```javascript
{
  vi: {
    common: { refresh, searchPlaceholder, status, ... },
    nav: { dashboard, incidents, assets, ... },
    auth: { loginTitle, username, password, ... },
    dashboard: { title, welcome, ganttTitle, ... },
    incidentsPage: { title, filters, table, ... },
    assetsPage: { title, filters, detail, ... },
    // ... more namespaces
  },
  en: { /* same structure */ }
}
```

**Parameterized Translations:**
```javascript
// Vietnamese
"dashboard.welcome": "Xin chào, {{name}}"
"dashboard.updatedAt": "Cập nhật lần cuối: {{time}}"

// Usage
t('dashboard.welcome', { name: user.username })
t('dashboard.updatedAt', { time: formatDate(now) })
```

---

### 🔟 Theme System (Dark/Light Mode)

**Provider**: `ThemeProvider.jsx`  
**Storage**: `localStorage.getItem('theme')`

**Implementation:**
```javascript
// Tailwind dark mode class strategy
<html className={isDark ? 'dark' : ''}>

// Component usage
<div className="bg-white dark:bg-slate-900">
  <p className="text-slate-900 dark:text-slate-100">Text</p>
</div>
```

**Toggle:**
```javascript
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

**Color Palette:**
```css
/* Light Mode */
--background: white;
--surface: slate-50;
--text-primary: slate-900;
--text-soft: slate-500;

/* Dark Mode */
--background: slate-950;
--surface: slate-900;
--text-primary: slate-100;
--text-soft: slate-400;
```

---

## Hướng dẫn sử dụng theo vai trò / Role-Based User Guides

### 👑 Admin - Quản trị viên

**Quyền hạn**: Toàn quyền quản trị hệ thống

#### ✅ Nhiệm vụ chính

**1. Quản lý tài sản (Asset Management)**

Tạo tài sản mới:
```
1. Đăng nhập với tài khoản Admin
2. Vào menu "Assets" (Tài sản)
3. Click nút "Create Asset" (nếu có UI) hoặc dùng API:

POST /api/assets
{
  "name": "Berth Delta",
  "type": "Berth",
  "status": "Active"
}

4. Hệ thống tự động:
   - Tạo assetId mới
   - Lưu vào assets.json
   - Ghi log: ASSET_CREATED
```

Cập nhật trạng thái tài sản:
```
PUT /api/assets/6
{
  "status": "Maintenance"
}

→ Crane #6 chuyển sang trạng thái bảo trì
→ Dashboard assets page hiển thị "Warning" badge
```

**2. Quản lý lượt tàu (Visit Management)**

Tạo lượt tàu mới:
```
1. Vào menu "Visits" (Lượt tàu)
2. Click "Add Visit"
3. Nhập thông tin:
   - Ship Name: "MV Pacific Crown"
   - ETA Original: "2025-11-03 14:00"
4. Submit

POST /api/visits
{
  "shipName": "MV Pacific Crown",
  "eta_original": "2025-11-03T14:00:00Z"
}

→ Hệ thống tạo visitId: 11
→ Status: "Scheduled"
```

Gán tasks cho lượt tàu:
```
1. Sau khi tạo visit, tạo tasks:

POST /api/tasks
{
  "visitId": 11,
  "assetId": 2,  // Berth Bravo
  "startTime": "2025-11-03T13:45:00Z",
  "endTime": "2025-11-03T14:45:00Z",
  "type": "Berthing"
}

2. Hệ thống kiểm tra:
   ✓ Visit #11 tồn tại
   ✓ Asset #2 tồn tại
   ✓ Không conflict với tasks khác của asset #2
   ✓ endTime > startTime

3. Nếu OK → task được tạo và hiển thị trên Gantt chart
```

**3. Kích hoạt lịch trình (Schedule Activation)**

Khi cần rollback hoặc activate version cũ:
```
1. Dashboard → Schedule Overview
2. Xem danh sách versions:
   - Version 1 (15 tasks) - Inactive
   - Version 2 (27 tasks) - Inactive
   - Version 3 (30 tasks) - Active ✓

3. Click version 2 → "Activate"

POST /api/schedule/activate
{ "scheduleId": 2 }

4. Hệ thống:
   - Set version 2 isActive = true
   - Set các version khác isActive = false
   - Copy version 2 tasks → tasks.json
   - Reload Gantt chart với 27 tasks
   - Log: SCHEDULE_ACTIVATED
```

**4. Xem báo cáo & KPI**

Dashboard overview:
```
- Operations Snapshot:
  • 2 incidents đang mở
  • 12/14 tài sản hoạt động
  • 3 công việc đang chạy
  • 2 tài sản đang bảo trì

- KPI Metrics:
  • Conflict Rate: 3.2%  (Good: < 5%)
  • Avg Waiting: 12 min  (Good: < 15 min)
  • Berth Utilization: 68%  (Optimal: 60-80%)

- Next Visit:
  • MV Delta Sky
  • Berth Bravo
  • ETA: 03/11/2025 17:00
```

Export activity logs:
```
1. Dashboard → Notification Center
2. Click "Export CSV"
3. Download logs.csv

File chứa toàn bộ:
- logId, timestamp, userId, eventType, description
- affected_assetId, affected_visitId
```

**5. Xử lý sự cố khẩn cấp**

Khi nhận báo cáo crane hỏng:
```
1. Dashboard → Incident Report Form
2. Fill form:
   - Type: "CraneDown"
   - Affected Asset: "Gantry Crane Cygnus (#6)"
   - Delay Minutes: 45
   - Reason: "Hydraulic leak detected"
3. Submit

→ System auto:
  - Tạo incident #7
  - Shift tất cả tasks dùng crane #6 thêm 5 phút
  - Tạo schedule version mới
  - Notify OPS team
  - Update KPIs
```

---

### 🎯 OPS - Điều phối viên (Operations)

**Quyền hạn**: Điều phối vận hành, báo cáo sự cố, xem KPI

#### ✅ Nhiệm vụ chính

**1. Giám sát lịch trình realtime**

Mỗi ca làm việc:
```
1. Đăng nhập: ops01 / ops123
2. Vào Dashboard
3. Kiểm tra Gantt chart:
   - Tasks đang chạy (màu nổi bật)
   - Upcoming tasks trong 2h tới
   - Asset assignments

4. Xem Operations Snapshot:
   - Bao nhiêu công việc đang active?
   - Tài sản nào đang idle?
   - Lượt tàu tiếp theo khi nào?
```

**2. Báo cáo sự cố**

**Scenario A: Tàu cập cảng trễ**
```
Tình huống: MV Baltic Wind báo delay 30 phút do sương mù

1. Dashboard → Incident Form
2. Chọn:
   - Type: "ShipDelay"
   - Affected Visit: "MV Baltic Wind (#4)"
   - Delay Minutes: 30
   - Reason: "Heavy fog at channel entrance"
3. Submit

Hệ thống tự động:
→ Shift tất cả tasks của visit #4 thêm 30 phút
→ Gantt chart update realtime
→ Thông báo crew chuẩn bị 30 phút sau
→ KPI recalculate
```

**Scenario B: Thời tiết xấu**
```
Tình huống: Gió mạnh, pilot boat không thể ra

1. Report incident:
   - Type: "Weather"
   - Affected Visit: "MV Fjord Spirit (#8)"
   - Delay: 60 minutes
   - Reason: "High winds keeping pilot boats on standby"

2. System response:
   - Notify ship captain
   - Reschedule berthing window
   - Alert asset managers
```

**3. Tạo tasks khẩn cấp**

Khi cần add task ngoài kế hoạch:
```
Tình huống: Cần move container khẩn từ yard ra gate

POST /api/tasks
{
  "visitId": 6,
  "assetId": 8,  // Yard Tractor 12
  "startTime": "2025-11-01T18:00:00Z",
  "endTime": "2025-11-01T18:30:00Z",
  "type": "Loading"
}

→ Task xuất hiện trên Gantt
→ Driver nhận notify
→ Asset manager chuẩn bị xe
```

**4. Monitor KPIs**

Quan sát chỉ số vận hành:
```
📊 Conflict Rate: 3.2%
   ✓ Good (< 5%)
   
📊 Avg Waiting: 18 min
   ⚠️ Warning (target < 15 min)
   → Action: Review task gaps, tối ưu transitions

📊 Berth Utilization: 68%
   ✓ Optimal (60-80%)
   
→ Nếu utilization > 85%: Cảnh báo overload
→ Nếu waiting > 20 min: Kiểm tra asset availability
```

**5. Xử lý incident queue**

Incidents Page workflow:
```
1. Vào /incidents
2. Filter: Status = "Open"
3. Xem danh sách:

   | Time  | Type       | Asset          | Delay | Status |
   |-------|------------|----------------|-------|--------|
   | 19:20 | Weather    | -              | 60min | Open   |
   | 12:05 | CraneDown  | Crane Cygnus   | 45min | InProgress |
   | 18:30 | BerthMaint | Berth Charlie  | 0min  | Open   |

4. Xử lý từng incident:
   - Liên hệ field team
   - Theo dõi tiến độ
   - Khi done → Click "Đánh dấu đã xử lý"
```

**6. Điều phối crew**

Dựa vào schedule assign công việc:
```
1. Xem upcoming tasks 2h tới
2. Assign drivers:
   - Task 17: Crane Atlas → Team A
   - Task 18: Tractor 12 → Driver Minh
   - Task 19: Gate 3 → Security Team

3. Notify qua radio/app:
   "Driver Minh: Tractor 12, Loading task, 17:50-19:10, Visit #6"
```

---

### 🚗 Driver - Nhân viên hiện trường

**Quyền hạn**: Báo cáo sự cố, xem lịch trình cá nhân

#### ✅ Nhiệm vụ chính

**1. Xem lịch trình cá nhân**

Mobile-optimized view:
```
1. Login: driver01 / driver123
2. Vào Dashboard hoặc /report
3. Xem tasks được assign:

   Today's Tasks:
   ✓ 08:55 - 09:40  Loading    MV Pacific Star  (Completed)
   → 17:50 - 19:10  Unloading  MV Delta Sky     (Next)
   ⏱ 21:50 - 23:40  Loading    MV Fjord Spirit  (Upcoming)
```

**2. Báo cáo sự cố nhanh**

**Scenario: Xe forklift hỏng**
```
1. Mở app → /report page
2. Chọn nhanh:
   [CraneDown] (hoặc tạo type mới "VehicleDown")
   Asset: Yard Tractor 12 (#8)
   Delay: 20 minutes
   Reason: "Engine overheating, needs cooldown"
3. Tap "Submit"

→ OPS team nhận instant notification
→ Dispatcher assign backup vehicle
→ Schedule auto-adjust
```

**Scenario: Phát hiện hư hại container**
```
Mobile Report:
- Type: Custom "Damage"
- Visit: Current ship
- Description: "Container C-12345 has dent on left side"
- Photo upload (nếu có tính năng)

→ Log ghi nhận
→ OPS escalate to supervisor
→ QA team kiểm tra
```

**3. Check-in/Check-out tasks** (Future feature)
```
Task lifecycle tracking:

1. Nhận task assignment (push notification)
2. Check-in khi bắt đầu:
   "Started Loading task at 17:52"
3. Update progress:
   "50% complete - 15 containers loaded"
4. Check-out khi hoàn thành:
   "Completed at 19:05 (5 min early)"

→ Real-time progress visible on Dashboard
→ OPS có visibility chính xác
```

**4. Xem thông tin tàu**

Visits page - driver view:
```
Filter: My Assigned Visits

MV Delta Sky
├─ ETA: 17:00
├─ Berth: Bravo
├─ My Tasks:
│  ├─ 17:50-19:10 Unloading (Tractor 12)
│  └─ 18:05-18:40 Loading (Gate 3)
├─ Contact: Ops Center x1234
└─ Notes: Reefer containers - priority handling
```

---

## Cài đặt & Triển khai / Installation & Deployment

### 🚀 Quick Start (Local Development)

**Prerequisites:**
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

**Step 1: Clone repository**
```bash
git clone https://github.com/yourusername/PortLinkOrchestrator.git
cd PortLinkOrchestrator
```

**Step 2: Install Backend**
```bash
cd backend
npm install

# Verify installation
node src/index.js
# → Server running on http://localhost:3000
```

**Step 3: Install Frontend**
```bash
cd ../portlink-frontend
npm install

# Start dev server
npm run dev
# → Frontend running on http://localhost:5173
```

**Step 4: Seed Data**
```
Backend tự động tạo seed data khi chạy lần đầu:
- users.json (3 demo accounts)
- assets.json (14 assets)
- visits.json (10 visits)
- tasks.json (30 tasks)
- schedules.json (3 versions)
- incidents.json (6 incidents)
- logs.json (20 logs)
- meta.json (counters)
```

**Step 5: Login**
```
Open http://localhost:5173
Login with:
  admin / admin123
  ops01 / ops123
  driver01 / driver123
```

---

### 📦 Production Build

**Backend:**
```bash
cd backend

# Production dependencies only
npm ci --production

# Set environment
export NODE_ENV=production
export PORT=3000
export JWT_SECRET=your-secret-key-here

# Run with PM2 (recommended)
npm install -g pm2
pm2 start src/index.js --name portlink-api

# Or with node
node src/index.js
```

**Frontend:**
```bash
cd portlink-frontend

# Build for production
npm run build
# → Output: dist/

# Preview production build
npm run preview

# Serve with nginx/Apache
# Copy dist/ to web server root
```

**Nginx config example:**
```nginx
server {
  listen 80;
  server_name portlink.example.com;
  root /var/www/portlink/dist;
  index index.html;

  # SPA routing
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Proxy API requests
  location /auth/ {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location /api/ {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
  }

  # Static assets caching
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

---

### 🐳 Docker Deployment

**Dockerfile (Backend):**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY src/ ./src/
EXPOSE 3000
CMD ["node", "src/index.js"]
```

**Dockerfile (Frontend):**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend/src/data:/app/src/data
    restart: unless-stopped

  frontend:
    build: ./portlink-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

**Run:**
```bash
# Set environment variables
echo "JWT_SECRET=your-production-secret" > .env

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

### ⚙️ Configuration

**Backend Environment Variables:**
```bash
# backend/.env
NODE_ENV=development          # development | production
PORT=3000                     # API server port
JWT_SECRET=my-secret-key      # JWT signing key (CHANGE IN PRODUCTION!)
JWT_EXPIRES_IN=24h            # Token expiry
CORS_ORIGIN=http://localhost:5173  # Frontend URL
```

**Frontend Environment Variables:**
```bash
# portlink-frontend/.env
VITE_API_BASE_URL=http://localhost:3000  # Backend API URL
VITE_APP_NAME=PortLink Orchestrator
VITE_DEFAULT_LOCALE=vi        # vi | en
```

**Data Directory:**
```bash
# Backend data storage location
backend/src/data/
├── users.json       # User accounts
├── assets.json      # Port assets
├── visits.json      # Ship visits
├── tasks.json       # Scheduled tasks
├── schedules.json   # Schedule versions
├── incidents.json   # Incidents
├── logs.json        # Activity logs
└── meta.json        # Metadata + counters

# Backup recommendation
crontab -e
0 2 * * * tar -czf /backup/portlink-data-$(date +\%Y\%m\%d).tar.gz /path/to/backend/src/data/
```

---

## API Documentation

### 🔐 Authentication

**POST /auth/login**
```javascript
// Request
{
  "username": "admin",
  "password": "admin123"
}

// Response 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "username": "admin",
    "role": "Admin"
  }
}

// Error 401 Unauthorized
{
  "error": "Invalid credentials"
}
```

**GET /auth/me**
```javascript
// Headers
Authorization: Bearer <token>

// Response 200 OK
{
  "userId": 1,
  "username": "admin",
  "role": "Admin",
  "createdAt": "2025-10-28T06:00:00Z"
}
```

---

### 🏗️ Assets

**GET /api/assets**
```javascript
// Query params (optional)
?type=Crane&status=Active

// Response 200 OK
[
  {
    "assetId": 4,
    "name": "Gantry Crane Atlas",
    "type": "Crane",
    "status": "Active"
  },
  ...
]
```

**POST /api/assets** (Admin only)
```javascript
// Request
{
  "name": "Berth Echo",
  "type": "Berth",
  "status": "Active"
}

// Response 201 Created
{
  "assetId": 15,
  "name": "Berth Echo",
  "type": "Berth",
  "status": "Active"
}
```

**PUT /api/assets/:assetId** (Admin only)
```javascript
// Request
{
  "status": "Maintenance"
}

// Response 200 OK
{
  "assetId": 6,
  "name": "Gantry Crane Cygnus",
  "type": "Crane",
  "status": "Maintenance"
}
```

---

### 🚢 Visits

**GET /api/visits**
```javascript
// Response 200 OK (enriched with task metadata)
[
  {
    "visitId": 1,
    "shipName": "MV Horizon",
    "eta_original": "2025-10-29T05:30:00Z",
    "eta_actual": "2025-10-29T05:45:00Z",
    "status": "Docked",
    // Enriched fields:
    "id": 1,
    "startTime": "2025-10-29T04:50:00Z",
    "endTime": "2025-10-29T07:30:00Z",
    "taskCount": 3,
    "durationMinutes": 160,
    "assetIds": [1, 4, 7],
    "assetName": "Berth Alpha, Gantry Crane Atlas, Yard Tractor 07",
    "primaryAssetId": 1,
    "primaryAssetName": "Berth Alpha",
    "lifecycle": "Completed"
  },
  ...
]
```

**POST /api/visits** (Admin only)
```javascript
// Request
{
  "shipName": "MV Ocean Star",
  "eta_original": "2025-11-03T08:00:00Z"
}

// Response 201 Created
{
  "visitId": 11,
  "shipName": "MV Ocean Star",
  "eta_original": "2025-11-03T08:00:00Z",
  "eta_actual": null,
  "status": "Scheduled",
  // ... enriched fields
}
```

---

### 📋 Tasks

**GET /api/tasks**
```javascript
// Query params (optional)
?assetId=4&visitId=2&from=2025-11-01T00:00:00Z&to=2025-11-02T00:00:00Z

// Response 200 OK (enriched)
[
  {
    "taskId": 5,
    "visitId": 2,
    "assetId": 5,
    "startTime": "2025-10-29T08:50:00Z",
    "endTime": "2025-10-29T10:20:00Z",
    "type": "Loading",
    // Enriched:
    "assetName": "Gantry Crane Borealis",
    "assetType": "Crane",
    "assetStatus": "Active",
    "shipName": "MV Pacific Star",
    "visitStatus": "Berthing",
    "durationMinutes": 90,
    "lifecycle": "Completed",
    "isActiveNow": false
  },
  ...
]
```

**POST /api/tasks** (Admin, OPS)
```javascript
// Request
{
  "visitId": 11,
  "assetId": 2,
  "startTime": "2025-11-03T07:45:00Z",
  "endTime": "2025-11-03T08:45:00Z",
  "type": "Berthing"
}

// Response 201 Created
{ "taskId": 31, ... }

// Error 409 Conflict
{
  "error": "Task overlaps with existing assignment for the same asset"
}
```

---

### 📅 Schedules

**GET /api/schedule/active**
```javascript
// Response 200 OK (enriched with summary)
{
  "scheduleId": 3,
  "version": 3,
  "createdAt": "2025-10-30T05:10:00Z",
  "isActive": true,
  "tasks": [ ... ], // 30 enriched tasks
  "summary": {
    "totalTasks": 30,
    "assetsInUse": 14,
    "visitsCovered": 10,
    "totalScheduledMinutes": 1200,
    "windowStart": "2025-10-29T04:50:00Z",
    "windowEnd": "2025-10-30T05:20:00Z",
    "activeNow": 2,
    "assetIds": [1,2,3,4,5,6,7,8,10,11,12,13,14],
    "visitIds": [1,2,3,4,5,6,7,8,9,10]
  }
}
```

**GET /api/schedule** (Admin, OPS)
```javascript
// Query params
?from=2025-11-01T00:00:00Z&to=2025-11-02T00:00:00Z

// Response 200 OK
{
  "scheduleId": 3,
  "version": 3,
  "tasks": [ ... filtered tasks ... ]
}
```

**POST /api/schedule/activate** (Admin, OPS)
```javascript
// Request
{
  "scheduleId": 2
}

// Response 200 OK
{
  "ok": true,
  "scheduleId": 2,
  "version": 2
}
```

**POST /api/engine/recalculate** (Admin, OPS)
```javascript
// Request
{
  "visitId": 4,          // Optional
  "assets": [6],         // Optional
  "delayMinutes": 30,
  "reason": "Ship delay due to fog"
}

// Response 202 Accepted
{
  "started": true,
  "scheduleId": 4,
  "version": 4
}
```

---

### 🚨 Incidents

**GET /api/incidents** (Admin, OPS)
```javascript
// Response 200 OK (enriched, sorted newest first)
[
  {
    "incidentId": 4,
    "type": "Weather",
    "affected": { "visitId": 8 },
    "delayMinutes": 60,
    "reason": "High winds keeping pilot boats on standby",
    "status": "Open",
    "createdAt": "2025-10-29T19:20:00Z",
    "updatedAt": "2025-10-29T19:20:00Z",
    "reportedBy": 2,
    // Enriched:
    "id": 4,
    "shipName": "MV Fjord Spirit",
    "reportedByName": "ops01",
    "statusLower": "open"
  },
  ...
]
```

**POST /api/incidents** (All roles)
```javascript
// Request
{
  "type": "CraneDown",
  "affected": { "assetId": 6 },
  "delayMinutes": 45,
  "reason": "Hydraulic leak detected"
}

// Response 202 Accepted
{
  "accepted": true,
  "incidentId": 7,
  "scheduleId": 4,
  "version": 4
}
```

---

### 📊 KPIs

**GET /api/kpis** (Admin, OPS)
```javascript
// Response 200 OK
{
  "conflictRate": 0.03,
  "avgWaitingMinutes": 12.5,
  "berthUtilization": 0.68,
  "totals": {
    "visits": 10,
    "tasks": 30,
    "assets": 14
  }
}
```

---

### 📝 Logs

**GET /api/logs** (Admin, OPS)
```javascript
// Query params (optional)
?limit=20&from=2025-11-01T00:00:00Z&to=2025-11-02T00:00:00Z&type=INCIDENT_REPORTED

// Response 200 OK
[
  {
    "logId": 20,
    "timestamp": "2025-10-30T05:12:00Z",
    "userId": 1,
    "eventType": "SCHEDULE_ACTIVATED",
    "description": "Schedule version 3 activated (Recalculation)",
    "affected_assetId": null,
    "affected_visitId": null
  },
  ...
]
```

**GET /api/logs/export.csv** (Admin, OPS)
```javascript
// Response 200 OK
Content-Type: text/csv
Content-Disposition: attachment; filename="logs.csv"

logId,timestamp,userId,eventType,description,affected_assetId,affected_visitId
20,2025-10-30T05:12:00Z,1,SCHEDULE_ACTIVATED,"Schedule version 3 activated",,
...
```

---

## Troubleshooting & FAQ

### ❓ Common Issues

**1. Backend không khởi động được**
```bash
# Error: EADDRINUSE :::3000
→ Port 3000 đã được sử dụng

# Fix:
# Option A: Kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option B: Change port
$env:PORT=3001; node src/index.js
```

**2. Frontend không connect được API**
```bash
# Error: Network Error / CORS
→ Backend chưa chạy hoặc CORS config sai

# Check:
curl http://localhost:3000/auth/login

# Fix CORS:
# backend/src/index.js
app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true
}));
```

**3. JWT Invalid Token**
```bash
# Error: 401 Unauthorized after login
→ Token expired hoặc JWT_SECRET khác nhau

# Check (in browser console):
localStorage.getItem('token')

# Fix:
# Clear old token
localStorage.removeItem('token')
# Login lại
```

**4. Tasks conflict khi tạo**
```bash
# Error: 409 "Task overlaps with existing assignment"
→ Asset đã có task trong cùng thời gian

# Check:
GET /api/tasks?assetId=5&from=2025-11-01T08:00:00Z&to=2025-11-01T10:00:00Z

# Fix:
# Adjust startTime/endTime để tránh overlap
# Hoặc dùng asset khác
```

**5. Gantt chart không hiển thị**
```bash
# Error: Blank Plotly chart
→ Tasks array rỗng hoặc invalid date format

# Check (in browser console):
console.log(tasks) // In Redux DevTools

# Fix:
# Verify tasks có data
# Check startTime/endTime format ISO 8601
```

**6. Dark mode không lưu**
```bash
# Error: Theme reset sau refresh
→ localStorage không write được

# Check (in browser console):
localStorage.setItem('theme', 'dark')
localStorage.getItem('theme')

# Fix:
# Check browser privacy settings
# Clear cache
```

---

### 💡 FAQ

**Q: Làm sao để thêm user mới?**
```bash
A: Hiện tại phải edit backend/src/data/users.json manually:

const crypto = require('crypto');
const hash = crypto.createHash('sha256').update('newpassword').digest('hex');

// Add to users.json:
{
  "userId": 4,
  "username": "ops02",
  "passwordHash": "<hash>",
  "role": "OPS",
  "createdAt": "2025-11-01T10:00:00Z"
}

// Future: Admin UI để tạo user
```

**Q: Có thể import lịch trình từ file Excel không?**
```bash
A: Chưa có tính năng built-in.

Workaround:
1. Convert Excel → JSON format
2. POST /api/visits và /api/tasks qua script

const visits = readExcel('visits.xlsx');
for (const v of visits) {
  await axios.post('/api/visits', v);
}
```

**Q: Làm sao để backup data?**
```bash
A: Copy toàn bộ backend/src/data/ folder:

# Manual backup (PowerShell)
$date = Get-Date -Format "yyyyMMdd"
Compress-Archive -Path backend\src\data\* -DestinationPath "backup-$date.zip"

# Automated backup (Task Scheduler)
# Tạo scheduled task chạy script backup mỗi ngày

# Restore:
Expand-Archive -Path backup-20251101.zip -DestinationPath backend\src\data\
```

**Q: Có thể tích hợp với hệ thống khác không?**
```bash
A: Có, qua REST API:

- ERP system → POST /api/visits (import ship schedule)
- Accounting → GET /api/logs/export.csv (audit trail)
- Mobile app → POST /api/incidents (field reports)
- BI tools → GET /api/kpis (analytics dashboard)

Auth: Pass JWT token trong Authorization header
```

**Q: Performance khi data lớn (>1000 tasks)?**
```bash
A: File-based JSON store có giới hạn:

Recommended limits:
- Tasks: < 500
- Visits: < 100
- Logs: < 1000 (auto-trim old logs)

Migration path:
1. Implement pagination backend
2. Migrate to SQL database (PostgreSQL)
3. Add caching layer (Redis)
4. Optimize Gantt rendering (virtualization)
```

**Q: Làm sao để change JWT secret trong production?**
```bash
A: Regenerate secret và restart server:

# Generate new secret (PowerShell)
$bytes = New-Object byte[] 64
(New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# Update .env
JWT_SECRET=<new-secret>

# Restart
pm2 restart portlink-api

# Users phải login lại (old tokens invalid)
```

---

## Đóng góp / Contributing

### 🤝 How to Contribute

1. **Fork repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### 📝 Development Guidelines

**Code Style:**
- Backend: ESLint + Prettier (Airbnb style guide)
- Frontend: ESLint + Prettier (React recommended)
- Use meaningful variable/function names
- Add JSDoc comments for complex logic

**Commit Messages:**
```
feat: add incident severity levels
fix: resolve Gantt chart timezone bug
docs: update API documentation
refactor: simplify task conflict detection
test: add KPI calculation unit tests
```

**Testing:**
```bash
# Backend tests (future)
cd backend
npm test

# Frontend tests
cd portlink-frontend
npm test

# E2E tests (Playwright)
npm run test:e2e
```

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 📞 Support & Contact

- **Documentation**: [GitHub Wiki](https://github.com/yourusername/PortLinkOrchestrator/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/PortLinkOrchestrator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/PortLinkOrchestrator/discussions)
- **Email**: support@portlink.example.com

---

## 🙏 Acknowledgments

- **Plotly.js** - Gantt chart visualization
- **Three.js** - 3D digital twin rendering
- **React** team - Amazing frontend framework
- **Tailwind CSS** - Beautiful utility-first CSS
- **Express.js** - Rock-solid backend framework

---

## 📊 Roadmap

### Version 1.1 (Q1 2026)
- [ ] Real-time notifications (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] PostgreSQL migration
- [ ] Unit test coverage > 80%

### Version 1.2 (Q2 2026)
- [ ] AI-powered schedule optimization
- [ ] Weather API integration
- [ ] IoT sensor data ingestion
- [ ] Multi-tenant support
- [ ] Advanced RBAC with custom permissions

### Version 2.0 (Q3 2026)
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] GraphQL API
- [ ] Real-time 3D twin with live asset tracking
- [ ] Predictive maintenance ML models

---

**Built with ❤️ by the PortLink Team**

_Last updated: November 2, 2025_