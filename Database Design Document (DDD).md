# Data Design Document (DDD)
PortLink Orchestrator — Phiên bản 1.0 (Demo, JSON Store)

---

## 1. Mục tiêu & Phạm vi
- Lưu trữ người dùng, tài sản (berth/crane/truck), lịch tàu, nhiệm vụ, lịch phiên bản và log sự kiện.
- Hỗ trợ demo kịch bản: 1 bến, 2 cầu, 2 tàu (A & B) và tình huống tàu A trễ 1 giờ.
- Ưu tiên SQLite cho demo; dễ chuyển sang PostgreSQL.

---

## 2. Công nghệ & Quy ước
- Lưu trữ: JSON files (thư mục `backend/data/`) cho demo và cPanel hosting (không cần DB server).
- Truy cập: Node.js đọc/ghi trực tiếp JSON; không dùng ORM; đảm bảo atomic theo lần ghi.
- Múi giờ: UTC trong JSON; UI hiển thị theo local/timezone cảng.

---

## 3. Lược đồ (JSON Files)
Các thực thể được lưu ở dạng mảng JSON trong các file sau (thư mục `backend/data/`):

### 3.1. `users.json`
- userId (number)
- username (string, unique)
- passwordHash (string, SHA-256 demo)
- role ("OPS"|"Driver"|"Admin")
- createdAt (ISO datetime)

### 3.2. `assets.json`
- assetId (number)
- name (string)
- type ("Berth"|"Crane"|"Truck")
- status ("Active"|"Inactive"|"Maintenance")

### 3.3. `visits.json`
- visitId (number)
- shipName (string)
- eta_original (ISO datetime)
- eta_actual (ISO datetime|null)
- status ("Scheduled"|"Arrived"|"Departed")

### 3.4. `tasks.json`
- taskId (number)
- visitId (number)
- assetId (number)
- startTime (ISO datetime)
- endTime (ISO datetime)
- type ("Loading"|"Unloading"|"Berthing")

### 3.5. `schedules.json`
- scheduleId (number)
- version (number)
- createdAt (ISO datetime)
- isActive (boolean)
- tasks (array of Task snapshot)

### 3.6. `logs.json`
- logId (number)
- timestamp (ISO datetime)
- userId (number|null)
- eventType (string)
- description (string)
- affected_assetId (number|null)
- affected_visitId (number|null)

### 3.7. `meta.json`
- counters: per-collection numeric counters for auto-increment ids
- createdAt, updatedAt

Retention:
- Giữ tối thiểu 90 ngày (RQN-010). Cron/Job dọn cũ.

---

## 4. Quan hệ (Logic)
- User(1) — (n) EventLog (tham chiếu qua userId trong logs.json)
- ShipVisit(1) — (n) Task (visitId)
- Asset(1) — (n) Task (assetId)
- Schedule chứa snapshot `tasks` tại thời điểm tạo phiên bản.

---

## 5. Ràng buộc nghiệp vụ
- Một Task gắn đúng 1 Asset tại 1 thời điểm; Greedy Engine đảm bảo không trùng lặp trên cùng Asset.
- Status của ShipVisit và Task được cập nhật theo thời gian thực tế khi demo.
- Version của Schedule tăng dần; đúng 1 Schedule IsActive=1 tại một thời điểm.

---

## 6. Dữ liệu mẫu (Demo Seed)
Users:
- admin / (hash) / Admin
- ops01 / (hash) / OPS
- driver01 / (hash) / Driver

Assets:
- (1) Berth 1 / Berth / Active
- (2) Crane 1 / Crane / Active
- (3) Crane 2 / Crane / Active

ShipVisits:
- (1) Ship A / ETA_original=2025-10-29T10:00:00Z
- (2) Ship B / ETA_original=2025-10-29T12:00:00Z

Tasks:
- A-berth: Visit=1, Asset=Berth1, 10:00–12:00, Berthing
- A-crane: Visit=1, Asset=Crane1, 10:00–12:00, Loading
- B-berth: Visit=2, Asset=Berth1, 12:00–14:00, Berthing
- B-crane: Visit=2, Asset=Crane2, 12:00–14:00, Unloading

Sự cố demo:
- 10:05 Ship A trễ 60 phút → Engine đẩy các task sau trên Berth1 từ 12:00 → 13:00.

---

## 7. Chỉ mục & Hiệu năng
- Không có chỉ mục DB vật lý; thao tác trong bộ nhớ của Node.
- Tối ưu cơ bản: nhóm theo assetId, sắp xếp theo startTime để phát hiện xung đột O(n log n).
- Logs: phân trang phía server bằng cách giới hạn số lượng (limit) và sort theo timestamp.

---

## 8. Bảo trì & Migration
- Không cần migrations; cấu trúc JSON đơn giản theo key như trên.
- Seed data tự động lần chạy đầu (backend sẽ tạo file JSON mẫu nếu thiếu).
- Có thể nâng cấp lên DB thật (PostgreSQL) trong tương lai bằng cách map các thực thể này sang bảng tương ứng.

---

## 9. Sao lưu & Lưu trữ
- JSON files: sao lưu định kỳ thư mục `backend/data/` (trước demo và sau mỗi lần diễn tập).
- EventLog retention: dọn dữ liệu > 90 ngày bằng job thủ công hoặc script Node (không bật mặc định trong demo).
